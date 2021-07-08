$(document).ready(() => {
    $('.deleteUser').on('click', deleteUser);
    $('.updateUser').on('click', updateUser);
})

function deleteUser() {
    var confirmation = confirm('Are you sure');
    if(confirmation){
        $.ajax({
            type: 'DELETE',
            url: '/users/delete/' + $(this).data('id')
        }).done((response) => {
            window.location.replace('/');
        })
        window.location.replace('/');
    }else{
        return false;
    }
};

function updateUser(){
    var confirmation = confirm('Would you like to update this user?');
    if(confirmation){
        $.ajax({
            type: 'PUT',
            url: '/users/update/' + $(this).data('id')
        }).done((response) => {
            window.location.replace('/');
        })
        window.location.replace('/');
    }else{
        return false;
    }
}