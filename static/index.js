/* eslint-env browser */
/* eslint-disable semi */

const remove = document.getElementById('js-remove')
const edit = document.getElementById('js-edit')

if (remove) {
  remove.addEventListener('click', onremove)
}

if (edit) {
  remove.addEventListener('click', onedit)
}


function onremove(ev) {
  const node = ev.target
  const id = node.dataset.id

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
  const node = ev.target
  const id = node.dataset.id

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
