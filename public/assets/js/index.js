$(document).ready(function () {
  var containerArticle = $('.container-article');
  $(document).on('click', '.btn.save', handleSaveArticle);
  $(document).on('click', '.scrape-new', handleSaveArticle);

  // get articles with initPage()
  function initPage() {
    $.get('/api/articles?saved=false').then(function (data) {
      containerArticle.empty();
      renderEmpty();
    });
  }

  function renderArticles(articles) {
    var articleSection = [];
    for (var i = 0; i < articles.length; i++) {
      articleSection.push(createSection(articles[i]));
    }
    containerArticle.append(articleSection);
  }

  //function to display error modal on ajax error
  function showErrorModal(error) {
    $('#error').modal('show');
  }

  //event listener to reload root when user closes modal showing
  //number of scraped articles
  $('#alertModal').on('hide.bs.modal', function (e) {
    window.location.href = '/';
  });

  //ARTICLES

  //click event to scrape new articles
  $('#scrape').on('click', function (event) {
    event.preventDefault();
    $.ajax({
      url: '/scrape/',
      type: 'GET',
      success: function (response) {
        $('#numArticles').text(response.count);
      },
      error: function (error) {
        showErrorModal(error);
      },
      complete: function (result) {
        $('#alertModal').modal('show');
      }
    });
  });

  // When you click the Save Article button
  $('#save').on('click', function () {
    var articleId = $(this).attr('data-id');
    console.log(articleId);

    $.ajax({
      url: '/save/' + articleId,
      type: 'GET',
      success: function (response) {
        window.location.href = '/';
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });

  //click event to delete an article from savedArticles
  $('#delete').on('click', function (event) {
    event.preventDefault();
    let id = $(this).data('id');
    $.ajax({
      url: '/deleteArticle/' + id,
      type: 'DELETE',
      success: function (response) {
        window.location.href = '/saved';
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });

  //NOTES

  //function to display notes in notemodal
  function showNote(element, articleId) {
    let $title = $('<p>').text(element.title).addClass('noteTitle');
    let $deleteButton = $('<button>').text('X').addClass('deleteNote');
    let $note = $('<div>')
      .append($deleteButton, $title)
      .attr('data-note-id', element._id)
      .attr('data-article-id', articleId)
      .addClass('note')
      .appendTo('#noteArea');
  }

  //function to post a note to server
  function sendNote(element) {
    let note = {};
    (note.articleId = $(element).attr('data-id')),
      (note.title = $('#noteTitleEntry').val().trim());
    note.body = $('#noteBodyEntry').val().trim();
    if (note.title && note.body) {
      $.ajax({
        url: '/createNote',
        type: 'POST',
        data: note,
        success: function (response) {
          showNote(response, note.articleId);
          $('#noteBodyEntry, #noteTitleEntry').val('');
        },
        error: function (error) {
          showErrorModal(error);
        }
      });
    }
  }

  //click event to open note modal and populate with notes
  $('#addNote').on('click', function () {
    $('#noteArea').empty();
    $('#noteTitleEntry, #noteBodyEntry').val('');
    let id = $(this).data('id');
    $('#submitNote, #noteBodyEntry').attr('data-id', id);
    $.ajax({
      url: '/getNotes/' + id,
      type: 'GET',
      success: function (data) {
        $.each(data.notes, function (i, item) {
          showNote(item, id);
        });
        $('#noteModal').modal('show');
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });

  //click event to create a note
  $('#submitNote').on('click', function (event) {
    event.preventDefault();
    sendNote($(this));
  });

  //keypress event to allow user to submit note with enter key
  $('#noteBodyEntry').on('keypress', function (event) {
    if (event.keyCode === 13) {
      sendNote($(this));
    }
  });

  //click event to delete a note from a saved article
  $(document).on('click', '.deleteNote', function (event) {
    event.stopPropagation();
    let thisItem = $(this);
    let ids = {
      noteId: $(this).parent().data('note-id'),
      articleId: $(this).parent().data('article-id')
    };

    $.ajax({
      url: '/deleteNote',
      type: 'POST',
      data: ids,
      success: function (response) {
        thisItem.parent().remove();
      },
      error: function (error) {
        showErrorModal(error);
      }
    });
  });

  //click event to retrieve the title and body of a single note
  //and populate the note modal inputs with it
  $(document).on('click', '.note', function (event) {
    event.stopPropagation();
    let id = $(this).data('note-id');
    $.ajax({
      url: '/getSingleNote/' + id,
      type: 'GET',
      success: function (note) {
        $('#noteTitleEntry').val(note.title);
        $('#noteBodyEntry').val(note.body);
      },
      error: function (error) {
        console.log(error);
        showErrorModal(error);
      }
    });
  });
});
