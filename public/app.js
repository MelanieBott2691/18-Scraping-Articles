// Whenever someone clicks a p tag
$(document).on('click', '.comment-btn', function () {
  // modal for commenting
  $('.modal').modal();
  $('.modal').modal('open');
  // Empty the notes from the note section
  $('.modal-content').empty();
  $('.modal-footer').empty();

  var thisId = $(this).attr('data-id');

  // Now make an ajax call for the Article
  $.ajax({
    method: 'GET',
    url: '/articles/' + thisId
  })
    // With that done, add the note information to the page
    .then(function (data) {
      console.log(data);
      var title = data.title;
      for (i = 0; i < data.comment.length; i++) {
        var id = data.comment[i];
        $.ajax({
          method: 'GET',
          url: '/comments' + id
        }).then(function (data) {
          console.log(data);
          $('.modal-content').prepend(
            '<tr><td>' +
              data.body +
              "</td><td><button class='btn btn-medium delete-comment' data-id='" +
              data._id +
              "'>Delete</button></td></tr>"
          );
          console.log(data.body);
        });
      }
      console.log(data);
      $('.modal-content').append('<h4>' + title + '</h4>');
      $('.modal-content').append('<p>New Comment</p>');
      $('.modal-content').append(
        "<textarea id='bodyinput' name='body'></textarea>"
      );
      $('.modal-footer').append(
        "<button class='btn btn-medium' data-id='" +
          data._id +
          "' id='save-comment'>Post</button>"
      );
    });
});

// When you click the save button
$(document).on('click', '#save-comment', function () {
  var id = $(this).attr('data-id');
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: 'POST',
    url: '/articles/' + id,
    data: {
      body: $('#bodyinput').val()
    }
  }).then(function (data) {});
  $('#bodyinput').val('');
  $('.modal').modal('close');
});

$('.save-article-btn').on('click', function (id) {
  console.log($(this).attr('data-id'));
  id = $(this).attr('data-id');
  console.log(id);
  $.ajax({
    url: 'saved/' + id,
    type: 'PUT'
  });
  location.reload();
});

// When you click the delete button
$(document).on('click', '.delete-comment', function (thisId) {
  console.log('all good!');
  console.log($(this).attr('data-id'));
  // Grab the id associated with the article from the submit button
  thisId = $(this).attr('data-id');
  console.log(thisId);
  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    url: 'deletecomment/' + thisId,
    type: 'DELETE'
  }).then(function (data) {});
  $('.modal').modal('close');
});

$('.delete-article-btn').on('click', function (id) {
  console.log($(this).attr('data-id'));
  id = $(this).attr('data-id');
  console.log(id);
  $.ajax({
    url: 'delete/' + id,
    type: 'DELETE'
  });
  location.reload();
});
