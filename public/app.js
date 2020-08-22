$(document).ready(function () {
  let id;
  let body;

  function saveArticle() {
    $.ajax({
      method: 'PUT',
      url: '/articles/' + id,
      data: {
        saved: true
      }
    }).then(function () {
      location.reload();
    });
  }

  function postNote() {
    $.ajax({
      method: 'POST',
      url: '/articles/' + id,
      data: {
        body: body
      }
    }).then(function () {
      location.reload();
    });
  }

  function deleteNote() {
    $.ajax({
      method: 'DELETE',
      url: '/notes/' + id
    }).then(function () {
      location.reload();
    });
  }

  function deleteArticle() {
    $.ajax({
      method: 'PUT',
      url: '/articles/' + id,
      data: {
        saved: false
      }
    }).then(function () {
      location.reload();
    });
  }

  $('.save').on('click', function (event) {
    event.preventDefault();
    id = $(this).attr('data-id');
    saveArticle();
  });

  $('.comment').on('submit', function (event) {
    event.preventDefault();
    id = $(this).attr('data-id');
    body = $(this).find('textarea').val();
    postNote();
  });

  $('.delComment').on('click', function (event) {
    event.preventDefault();
    id = $(this).attr('data-id');
    deleteNote();
  });

  $('.delete').on('click', function (event) {
    event.preventDefault();
    id = $(this).attr('data-id');
    deleteArticle();
  });
});
