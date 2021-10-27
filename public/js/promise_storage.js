getImages: function(uid, images) {        
  Promise.all(images.map((filename) => {
    return new Promise((resolve, reject) => {
      var ref = firebaseApp.storage().ref('images/' + uid + "/" + filename);
      ref.getDownloadURL().then(function(url) {
        resolve(url);
      }).catch(function(error) {
        // Uncomment this line to ignore errors.
        reject(error);
        switch (error.code) {
          case 'storage/object_not_found':
            // File doesn't exist
            console.log('Object not found');
            break;

          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log('You do not have the right permissions');
            break;

          case 'storage/canceled':
            // User canceled the upload
            console.log('Canceled');
            break;

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            console.log('Who knows...');
            break;
        }
      })
    });
  })).then((finalImages) => {
    // all images.
  })
}