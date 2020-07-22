$('#scrape-btn').on('click', function (event) {
  console.log('scraping articles...')
  event.preventDefault()

  $('#article-body').empty()

  $.ajax('/scrape', {
    type: 'GET'
  }).then(function () {
    console.log('Scrape complete')
    window.location = '/'
  })
})
