/* eslint-env browser */
/* eslint-disable semi */

var remove = document.getElementById('js-remove')
var edit = document.getElementById('js-edit')

if (remove) {
  remove.addEventListener('click', onremove)
}

if (edit) {
  remove.addEventListener('click', onedit)
}


function onremove(ev) {
  var node = ev.target
  var id = node.dataset.id

  fetch('/delete/' + id, {method: 'delete'})
    .then(onresponse)
    .then(onload, onfail)

  function onresponse(res) {
    return res.json()
  }

  function onload() {
    window.location = '/'
  }

  function onfail() {
    throw new Error('Could not delete!')
  }
}

function onedit(ev) {
  var node = ev.target
  var id = node.dataset.id

  fetch('/' + id, {method: 'edit'})
    .then(onresponse)
    .then(onload, onfail)

  function onresponse(res) {
    return res.json()
  }

  function onload() {
    window.location = '/'
  }

  function onfail() {
    throw new Error('Could not edit!')
  }
}
