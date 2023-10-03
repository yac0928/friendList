const URL = 'https://user-list.alphacamp.io/api/v1/users'

const friends = []
const FRIENDS_PER_PAGE = 16

const cardPanel = document.querySelector('#card-panel')
const modalTitle = document.querySelector('.modal-title')
const modalGender = document.querySelector('#modal-gender')
const modalAge = document.querySelector('#modal-age')
const modalBirthday = document.querySelector('#modal-birthday')
const modalRegion = document.querySelector('#modal-region')
const modalEmail = document.querySelector('#modal-email')
const modalImage = document.querySelector('#modal-image')
const paginator = document.querySelector('#paginator')
const modalPanel = document.querySelector('#exampleModal')


// Render Card Panel
function renderCardPanel(list) {
  let rawHTML = ''
  list.forEach(friend => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="p-3">
          <div class="card" style="width: 18rem;">
            <button type="button" class="btn btn-light btn-show-modal" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id=${friend.id}>
              <img src=${friend.avatar} class="card-img-top" alt="friend-image">
            </button>
            <div class="card-body">
              <p class="card-title fw-bold">${friend.name + ' ' + friend.surname}</p>
              <button type="button" class="btn">
                <i class="fa-solid fa-heart-circle-plus fa-2xl add-to-favorite" data-id=${friend.id} style="color: #fc1d1d;"></i>
              </button>
              <button type="button" class="btn" data-id=${friend.id}>
                <i class="fa-solid fa-heart-circle-minus fa-2xl remove-from-favorite" data-id=${friend.id} style="color: #fc1d1d;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  cardPanel.innerHTML = rawHTML
}

// Render Paginator
function renderPaginator(amount) {
  let numberOfPages = Math.ceil(amount / FRIENDS_PER_PAGE)
  for (let page = 1; page < numberOfPages; page++) {
    paginator.innerHTML += `
      <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
    `
  }
}

// Get Friends By Page
function getFriendsByPage(page) {
  const startIndex = (page - 1) * FRIENDS_PER_PAGE
  return friends.slice(startIndex, startIndex + FRIENDS_PER_PAGE)
}

// Render Modal
function renderModal(id) {
  id = id - 1
  modalTitle.innerHTML = friends[id].name + " " + friends[id].surname
  modalGender.innerHTML = "Gender: " + `<u>${friends[id].gender}</u>`
  modalAge.innerHTML = "Age: " + `<u>${friends[id].age}</u>`
  modalBirthday.innerHTML = "Birthday: " + `<u>${friends[id].birthday}</u>`
  modalRegion.innerHTML = "Region: " + `<u>${friends[id].region}</u>`
  modalEmail.innerHTML = "Email: " + `<u>${friends[id].email}</u>`
  modalImage.innerHTML = `
  <img src=${friends[id].avatar} class="img-fluid" alt="${friends[id].name}'s image">
  `
}

// Add To Favorite

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const friend = friends.find((friend) => friend.id === id)
  if (list.some((item) => item.id === id)) {
    return alert("It's already added！")
  }
  list.push(friend)
  localStorage.setItem('favoriteFriends', JSON.stringify(list))
  return alert("Successfully added！")
}

// Remove From Favorite
function removeFromFavorite(id) {
  let friend = friends.find((friend) => friend.id === id)
  if (list.some((friend) => friend.id === id)) {
    list.splice(list.indexOf(friend), 1)
    localStorage.setItem('favoriteFriends', JSON.stringify(list))
    return alert("Successfully removed！")
  }
  return alert("It's not in the favorite list yet！")
}

// 監聽器 on card - Show Modal、Add To Favorite、Remove From Favorite
cardPanel.addEventListener('click', function onPanelClicked(e) {
  if (e.target.parentNode.matches('.btn-show-modal')) {
    renderModal(Number(e.target.parentNode.dataset.id))
  } else if (e.target.matches('.add-to-favorite')) {
    addToFavorite(e.target.dataset.id)
    console.log(e.target.dataset.id)
  } else if (e.target.matches('.remove-from-favorite')) {
    removeFromFavorite(e.target.dataset.id)
  }
  console.log(e.target)
})

modalPanel.addEventListener('click', function onModalClicked(e) {
  if (e.target.matches('.add-to-favorite')) {
    addToFavorite(e.target.dataset.id)
    console.log(e.target.dataset.id)
  } else if (e.target.matches('.remove-from-favorite')) {
    removeFromFavorite(e.target.dataset.id)
  }
})


// 監聽器-paginator
paginator.addEventListener('click', function onPaginatorClicked(e) {
  let page = Number(e.target.dataset.page)
  renderCardPanel(getFriendsByPage(page))
})

axios.get(URL)
  .then(response => {
    friends.push(...response.data.results)
    renderCardPanel(getFriendsByPage(1))
    renderPaginator(friends.length)
  })