import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import { setMetaTags } from './headModifire'

document.querySelector('#app').innerHTML = `
  <div>
    <p>This will update the corrisponding meta tags. I the url is empty the current url will be used.</p>
    <form>
      <label for="metaTitle">Title:</label>
      <input type="text" id="metaTitle" name="metaTitle">
      <label for="metaDescipt">Description:</label>
      <input type="text" id="metaDescipt" name="metaDescipt">
      <label for="metaURL">cononical URL:</label>
      <input type="text" id="metaURL" name="metaDescipt">
      <button id="submitButton">Submit</button>
    </form>
    <p id="confermation"/>
  </div>
`

document.querySelector('#submitButton').addEventListener('click', submitInput)

function submitInput(event) {
  event.preventDefault();

  var titleInput = document.querySelector("#metaTitle");
  var descritpionInput = document.querySelector('#metaDescipt');
  var urlInput = document.querySelector('#metaURL');

  var title = titleInput.value;
  var descritpion = descritpionInput.value;
  var url = urlInput.value;

  if (!url) {
    //get cononical url
    url = window.location.href;
  }


  setMetaTags({title: title, description: descritpion, cononicalURL: url});

  titleInput.value = "";
  descritpionInput.value = "";
  urlInput.value = "";

  document.querySelector('#confermation').innerText = "Meta tags updated!";
}
