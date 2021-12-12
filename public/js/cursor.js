// pagination system
// this class create a pagination system for firebase realtime database
// it has next() nad previous() functions which returs data from firebase database based on the referans node
// if the referance node is VERBs, then it gets the questions related VERBs from the database
totalQuestionCount_cursor = 0

class Cursor {
  // constructor for cursor
  // inputs are baseRef which is the firebase database ref node
  // input pageSizes define the number of items to be retrieved for each page
  constructor(baseRef, pageSize) {
    //database referance node
    this.baseRef = baseRef;
    
   
    // These defines from where the data retrival starts and ends
    this.firstKey = null;
    this.lastKey = null;

    // pagination starts from the lastest added item and goes backwards
    // this keys help to stop paginetion previous() to stop when it reaches the latest item
    this.databaseLastKey = null;

    // it defines from where the data retrival starts
    this.firstIndex = 0;
    this.lastIndex = 0;

    //Its value is set to 1 when we reach at the end of database items so that user cannot go further
    this.lastRecord = 0;
    // stores in which page we are currently at
    this.pageIndex = 0;
    // page size defines how many items to be retrived from database
    this.pageSize = pageSize;
  }

  // Displaying the first and the last item number of the page
  displayIndex() {
    $("#index-text").text(
      "Page " +
        this.pageIndex +
        "   (" +
        this.firstIndex.toString() +
        " - " +
        this.lastIndex.toString() +
        ")"
    );
  }

  // Gets -pageSize- number of items from database starting from the -firstKey-
  // Starts from the end of the database and moves backwards to get always the latest items
  next() {
    let ref = this.baseRef;

    if (this.lastKey !== null) {
      // a previous page has been loaded so get the next one using the previous value/key
      // we have to start from the current cursor so add one to page size
      ref = ref.endAt(this.firstKey).limitToLast(this.pageSize + 1);
    } else {
      // this is the first page
      ref = ref.limitToLast(this.pageSize);
      this.firstIndex = 1;
      this.pageIndex = 1;
      this.lastIndex = this.pageSize;
      this.displayIndex();
    }

    return ref.once("value").then((snap) => {
      const keys = [];
      const data = [];

      // store data in array so it's ordered
      snap.forEach((ss) => {
        data.push(ss.val());
        keys.push(ss.key);
      });
      console.log("data.length");
      console.log(data.length);
      totalQuestionCount_cursor = data.length;

      if (data.length == 1 && this.firstIndex != 1) {
        this.lastRecord = 1;
        return null;
      }

      console.log(data);
      if (this.lastKey !== null) {
        // skip the first value, which is actually the cursor
        keys.pop();
        data.pop();
      }

      // store the last loaded record
      if (data.length) {
        if (this.lastKey !== null) {
          //increasing the indexes
          this.firstIndex += this.pageSize;
          this.lastIndex += this.pageSize;
          this.pageIndex += 1;
          // displaying the page number and the indexes on the webpage
          this.displayIndex();
        }

        const last = data.length - 1;
        console.log(data.length);

        // if there is less data than than the pagesize, it means that we are at the last page, we cannot paginate further
        if (data.length < this.pageSize) {
          this.lastRecord = 1;
        }

        // Stores first and the last data items keys to check later
        this.lastKey = keys[last];
        this.firstKey = keys[0];

        if (this.databaseLastKey == null) {
          this.databaseLastKey = this.lastKey;
        }

        console.log("first key");
        console.log(this.firstKey);
        console.log("LAST key");
        console.log(this.lastKey);
      }

      console.log(data);
      return data;
    });
  }

  // Gets -pageSize- number of items from database starting from the -lastKey-
  // Moves forward to the latest item in the database
  previous() {
    let ref = this.baseRef;

    if (this.lastKey !== null) {
      // a previous page has been loaded so get the next one using the previous value/key
      // we have to start from the current cursor so add one to page size
      ref = ref.startAt(this.lastKey).limitToFirst(this.pageSize + 1);
      this.firstIndex -= this.pageSize;
      this.lastIndex -= this.pageSize;
      this.pageIndex -= 1;
      this.displayIndex();
    } else {
      return;
    }

    return ref.once("value").then((snap) => {
      const keys = [];
      const data = []; // store data in array so it's ordered

      snap.forEach((ss) => {
        data.push(ss.val());
        keys.push(ss.key);
      });

      if (this.lastKey !== this.databaseLastKey) {
        // remove the last value, which is actually the cursor
        keys.shift();
        data.shift();
        this.lastRecord = 0;
      } else {
        this.lastRecord = 1;
      }

      // store the last loaded record
      if (data.length) {
        const last = data.length - 1;
        this.lastKey = keys[last];
        this.firstKey = keys[0];
      }
      console.log(this.firstKey);
      console.log(this.lastKey);
      return data;
    });
  }
}
