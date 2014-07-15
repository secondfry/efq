$('#trust-add').click(function(){
  CCPEVE.requestTrust('http://' + document.location.host);
});

if (window.CCPEVE && trusted === true) {
  $.post('/pilot/findOrAdd');
}

socket.get('/queue', function(data) {
  $.each(data, function() {
    addQueueLine(this)
  });
});

$('#login-form').submit(function(e){
  e.preventDefault();
  $.post('/admin/loginOrReg', {password: $('#login-password').val()})
});

$('#queue-join').click(function(){
  $(this).hide();
  $('#fit-form').show()
});

$('#fit-form').submit(function(e){
  e.preventDefault();
  $.post('/queue/join', {fit: prepareFit($('#fit').val())});
  $(this).hide();
  $('#queue-leave').show()
});

$('#queue-leave').click(function(){
  $.post('/queue/remove', {name: $('#charname').html()});
  $(this).hide();
  $('#queue-join').show()
});