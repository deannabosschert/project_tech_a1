/* eslint-env browser */
/* eslint-disable semi */

const removeProfile = document.getElementById('js-remove-profile')
const editProfile = document.getElementById('js-edit-profile')
const removeMoodboard = document.getElementById('js-remove-moodboard')
const editMoodboard = document.getElementById('js-edit-moodboard')


if (removeProfile) {
  remove.addEventListener('click', onremoveProfile)
}
if (editProfile) {
  remove.addEventListener('click', oneditProfile)
}
if (removeMoodboard) {
  remove.addEventListener('click', onremoveMoodboard)
}
if (editMoodboard) {
  remove.addEventListener('click', oneditMoodboard)
}


// geen idee meer hoe dit exact exact werkt --> navragen
function onremoveProfile(ev) {
  const node = ev.target
  const id = node.dataset.id

  fetch('/deleteProfile/' + id, {method: 'delete'})
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

function oneditProfile(ev) {
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

function onremoveMoodboard(ev) {
  const node = ev.target
  const id = node.dataset.id

  fetch('/deleteMoodboard/' + id, {method: 'delete'})
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


function oneditMoodboard(ev) {
  const node = ev.target
  const id = node.dataset.id

  fetch('/moodboards' + id, {method: 'edit'})
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
