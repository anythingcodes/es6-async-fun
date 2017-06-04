/*
  ------------------------------
  SHARED VARIABLES AND FUNCTIONS
  ------------------------------
*/
const statusContainer = document.getElementById('status');
const profileContainer = document.getElementById('profile'); 
const tweetsContainer = document.getElementById('tweets'); 
const mentionedFriendContainer = document.getElementById('friend');

// Promise-based request() function
function request(url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
      if (this.status >= 200 && this.status < 300) { 
        resolve(JSON.parse(xhr.response));
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function() {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}



//------------------------------------------------------------------------------



/*
  --------------------
  VERSION 1: CALLBACKS
  --------------------
*/

// // Get profile, then tweets, then mentioned friend
// $.ajax({
//   type: 'GET',
//   url: 'profile.json', // Getting a JSON file acts just like hitting an API
//   success: profile => {
    
//     $(statusContainer).append('<li>Fetched profile</li>');
//     $(profileContainer).html(JSON.stringify(profile));
     
//     // Get tweets, passing our profile id
//     $.ajax({
//       type: 'GET',
//       url: `tweets.json?id=${profile.id}`,
//       success: tweets => {
//         $(statusContainer).append('<li>Fetched tweets</li>');
//         $(tweetsContainer).html(JSON.stringify(tweets));
        
//         // Get friend mentioned in first tweet
//         $.ajax({
//           type: 'GET',
//           url: `friend.json?id=${tweets[0].usersMentioned[0].id}`,
//           success: friend => {
//             $(statusContainer).append('<li>Fetched mentioned friend</li>');
//             $(mentionedFriendContainer).html(JSON.stringify(friend));
//           },
//           error: (xhr, errorStatus, error) => {
//             $(statusContainer).append(`<li>Error: ${error.toString()}</li>`).addClass('error');
//           }
//         });
//       },
//       error: (xhr, errorStatus, error) => {
//         $(statusContainer).append(`<li>Error: ${error.toString()}</li>`).addClass('error');
//       }
//     });
    
//   },
//   error: (xhr, errorStatus, error) => {
//     $(statusContainer).append(`<li>Error: ${error.toString()}</li>`).addClass('error');
//   }
// });



//------------------------------------------------------------------------------



/*
  -----------------------------------------------
  VERSION 2: CLEANER FUNCTION-REFENCING CALLBACKS
  -----------------------------------------------
*/

// // Get profile, then tweets, then mentioned friend
// $.ajax({
//   type: 'GET',
//   url: 'profile.json', // Getting a JSON file acts just like hitting an API
//   success: getTweets,
//   error: handleError
// });

// function getTweets(profile) {
//   $(statusContainer).append('<li>Fetched profile</li>');
//   $(profileContainer).html(JSON.stringify(profile));
  
//   // Get tweets, passing our profile id
//   $.ajax({
//     type: 'GET',
//     url: `tweets.json?id=${profile.id}`,
//     success: getMentionedUser,
//     error: handleError
//   });
// }
// function getMentionedUser(tweets) {
//   $(statusContainer).append('<li>Fetched tweets</li>');
//   $(tweetsContainer).html(JSON.stringify(tweets));
  
//   // Get friend mentioned in first tweet
//   $.ajax({
//     type: 'GET',
//     url: `friend.json?id=${tweets[0].usersMentioned[0].id}`,
//     success: friend => {
//       $(statusContainer).append('<li>Fetched mentioned friend</li>');
//       $(mentionedFriendContainer).html(JSON.stringify(friend));
//     },
//     error: handleError
//   });
// }
// function handleError(xhr, errorStatus, error) {
//   $(statusContainer).append(`<li>Error: ${error.toString()}</li>`).addClass('error');
// }



//------------------------------------------------------------------------------



/*
  -------------------------------
  VERSION 3: PROMISES
  -------------------------------
*/

// // Get profile, then tweets, then mentioned friend
// request('profile.json')
//   .then(profile => {
//     statusContainer.innerHTML += '<li>Fetched profile</li>';
//     profileContainer.innerHTML = JSON.stringify(profile);
  
//     // Get tweets, passing our profile id
//     return request(`tweets.json?id=${profile.id}`);
//   })
//   .then(tweets => {
//     statusContainer.innerHTML += '<li>Fetched tweets</li>';
//     tweetsContainer.innerHTML = JSON.stringify(tweets);
    
//     // Get friend mentioned in first tweet
//     return request(`friend.json?id=${tweets[0].usersMentioned[0].id}`);
//   })
//   .then(friend => {
//     statusContainer.innerHTML += '<li>Fetched mentioned friend</li>';
//     mentionedFriendContainer.innerHTML = JSON.stringify(friend);
//   })
//   .catch(err => {
//     statusContainer.innerHTML += `<li>Error: ${err.toString()}</li>`;
//     statusContainer.classList.add('error');
//   });



//------------------------------------------------------------------------------



/*
  ------------------------------------------------------------
  VERSION 4: FETCH 
  Fetch is a promise-based API built into ES6 that we can use. 
  Much easier than writing our own request() function!
  ------------------------------------------------------------
*/

// // Get profile, then tweets, then mentioned friend
// fetch('profile.json') // Getting a JSON file acts just like hitting an API

//   // Return response JSON for processing in next then()
//   .then(response => response.json())
//   .then(profile => {
//     statusContainer.innerHTML += '<li>Fetched profile</li>';
//     profileContainer.innerHTML = JSON.stringify(profile);
    
//     // Get tweets, passing our profile id
//     return fetch(`tweets.json?id=${profile.id}`);
//   })
  
//   // Return response JSON for processing in next then()
//   .then(tweetsResponse => tweetsResponse.json())
//   .then(tweets => {
//     statusContainer.innerHTML += '<li>Fetched tweets</li>';
//     tweetsContainer.innerHTML += JSON.stringify(tweets);
    
//     // Get friend mentioned in first tweet
//     return fetch(`friend.json?id=${tweets[0].usersMentioned[0].id}`);
//   })
//   // Return response JSON for processing in next then()
//   .then(friendResponse => friendResponse.json())
//   .then(friend => {
//     statusContainer.innerHTML += '<li>Fetched mentioned friend</li>';
//     mentionedFriendContainer.innerHTML += JSON.stringify(friend);
//   })
//   .catch(err => {
//     statusContainer.innerHTML += `<li>Error: ${err.toString()}</li>`;
//     statusContainer.classList.add('error');
//   });
  
  
  
//------------------------------------------------------------------------------
  


/*
  ------------------------------
  VERSION 5: GENERATOR FUNCTIONS
  ------------------------------
*/

function* createTweetFetcher() {
  // Get profile, then tweets, then mentioned friend
  const profileID = yield request('profile.json');
  const friendID = yield request(`tweets.json?id=${profileID}`);
  yield request(`friend.json?id=${friendID}`);
}

const tweetFetcher = createTweetFetcher();
tweetFetcher.next().value
  .then(profile => {
    statusContainer.innerHTML += '<li>Fetched profile</li>';
    profileContainer.innerHTML = JSON.stringify(profile);
    return tweetFetcher.next(profile.id).value;
  })
  .then(tweets => {
    statusContainer.innerHTML += '<li>Fetched tweets</li>';
    tweetsContainer.innerHTML += JSON.stringify(tweets);
    const { id: friendID } = tweets[0].usersMentioned[0];
    return tweetFetcher.next(friendID).value;
  })
  .then(friend => {
    statusContainer.innerHTML += '<li>Fetched mentioned friend</li>';
    mentionedFriendContainer.innerHTML = JSON.stringify(friend);
    return tweetFetcher.next(); // final next() switches generator to done:true
  })
  .catch(err => console.log(err));
