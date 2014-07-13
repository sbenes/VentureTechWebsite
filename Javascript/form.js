/*************
* Puts the form labels into the input elements as input hints.
*
* @Require jquery
* @Author Scott Benes (sbenes)
*************/
jQuery(function($){
  var $labels = $('.genform .label').filter(':not(.name_field .extra_value_name)');
  
  var makePlaceholder = function makePlaceholder($input, text) {
    return ($input.closest('.question.user_entry_required, .form_field .user_entry_required') ? '*': '') + text;
  };
  
  var updateInputs = function(){
    $labels.each(function(){
      var $l = $(this);
      var $input = $(this).siblings('input[type=text], textarea');
      
      if ($input.length) {
        $input.attr('placeholder', makePlaceholder($input, $l.text())); 
        return;
      }
      
      $input = $(this).closest('.form_field').find('input[type=text]');
      if ($input.length) {
        $input.attr('placeholder', makePlaceholder($input, $l.text()));
        return;
      }
      
      $input = $(this).closest('.form_field').find('select');
      if ($input.length) {
        $input.find('option:first').text(makePlaceholder($input, $l.text()));
        return;
      }
      
    });
  }; 
  
  //run the form update at page load
  updateInputs();
});