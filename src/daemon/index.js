import FacebookAdvertObserver from './page/FacebookAdvertObserver.js';
import '../common/chromeStorage.js';
import initBackground from './background';
import api from './api.js';

const initPage = () => {
  FacebookAdvertObserver.run();
};

chrome.storage.promise.local.get('general_token')
  .then((result) => {
    if (result.general_token) { // Client is authenticated
      api.addMiddleware(request => {
        request.options.headers.Authorization = result.general_token;
      });
      if (window.location.protocol === 'chrome-extension:') { // Determine whether daemon is running in context of webpage, or in the background
        initBackground();
      } else {
        initPage();
      }
    } else {
      // No auth token found
    }
  }).catch((error) => {
    console.log(error);
  })
  .finally(() => {
    if (window.location.protocol === 'chrome-extension:') { // Determine whether daemon is running in context of webpage, or in the background
      initBackground();
    } else {
      initPage();
    }
  });
