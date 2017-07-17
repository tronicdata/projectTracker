// Projectlist data array for filling in info box
var projectListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the Project table on initial page load
    console.log("here1");
    populateTable();

    // Projectname link click
   $('#pList table tbody').on('click', 'td a.linkshowproject', showProjectInfo);

    // Delete Project link click
    $('#pList table tbody').on('click', 'td a.linkdeleteproject', deleteProject);

    // Add Project button click
    $('#btnUpdateProject').on('click', updateProject);

    // Update Project link click
    $('#pList table tbody').on('click', 'td a.linkupdateproject', updateProjectShow);

});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    $('#updateProject').hide();
    $('#projectInfo').hide();

    // jQuery AJAX call for JSON
    $.getJSON( '/projects/projectlist', function( data ) {
        console.log(data);
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkupdateproject" rel="' + this._id + '"><img src="/images/pencil_icon.svg" /></a><a href="#" class="linkdeleteproject" rel="' + this._id + '"><img src="images/delete_icon.svg"></a></td>';
            tableContent += '<td><a href="#" class="linkshowproject" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.status + '</td>';
            tableContent += '</tr>';
            // Stick our project data array into a projectlist variable in the global object
            projectListData = data;
        });

        // Inject the whole content string into our existing HTML table
        $('#pList table tbody').html(tableContent);
    });
    $.getJSON( '/projects/logs', function( data ) {
        console.log(data);
        // For each item in our JSON, add a table row and cells to the content string
        /*$.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkupdateproject" rel="' + this._id + '"><img src="/images/pencil_icon.svg" /></a><a href="#" class="linkdeleteproject" rel="' + this._id + '"><img src="images/delete_icon.svg"></a></td>';
            tableContent += '<td><a href="#" class="linkshowproject" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.status + '</td>';
            tableContent += '</tr>';
            // Stick our project data array into a projectlist variable in the global object
            projectListData = data;
        });*/

        // Inject the whole content string into our existing HTML table
        //$('#pList table tbody').html(tableContent);
    });
};

// Show project Info
function showProjectInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    //hide update section
    $('#updateProject').hide();

    // Retrieve projectname from link rel attribute
    var thisProjectName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = projectListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisProjectName);

    // Get our project Object
    var thisProjectObject = projectListData[arrayPosition];

    //Populate Info Box
    $('#projectInfoName').text(thisProjectObject.name);
    $('#projectInfoStatus').text(thisProjectObject.status);
    $('#projectInfoReference').text(thisProjectObject.reference);
    $('#projectInfoUrl').text(thisProjectObject.url);
    $('#projectInfoTags').text(thisProjectObject.tags);

    $('#projectInfo').toggle();

};

// Delete Project
function deleteProject(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Project?');

    // Check and make sure the Project confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/projects/deleteproject/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};

function updateProject(event) {

    // Prevent Link from Firing
    event.preventDefault();

    //hide project info
    $('#projectInfo').hide();

    //Get Project ID
    var projectID = $('#btnUpdateProject').attr('rel');

    // If it is, compile all Project info into one object
    var newProject = {
        'name': $('#updateProject fieldset input#editinputProjectName').val(),
        'status': $('#updateProject fieldset input#editinputProjectStatus').val(),
        'reference': $('#updateProject fieldset textarea#editinputProjectReference').val(),
        'tags': $('#updateProject fieldset input#editinputProjectTags').val(),
        'url': $('#updateProject fieldset input#editinputProjectUrl').val()

    }

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to update this project?');

    // Check and make sure the Project confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'PUT',
            data: newProject,
            url: '/projects/updateproject/' + projectID,
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
              // Clear the form inputs
              alert('updated!');
              $('#updateProject').hide();
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }
};
function updateProjectShow(event) {

    // Prevent Link from Firing
    event.preventDefault();

    //hide project info
    $('#projectInfo').hide();

    // Retrieve Projectname from link rel attribute
    var thisProjectName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = projectListData.map(function(arrayItem) { return arrayItem['_id']; }).indexOf(thisProjectName);

    // Get our Project Object
    var thisProjectObject = projectListData[arrayPosition];

    //Populate update Project Box
    console.log(thisProjectObject.name);
    console.log(thisProjectObject.tags);
    $('#updateProject fieldset input#editinputProjectName').val(thisProjectObject.name)
    $('#updateProject fieldset input#editinputProjectStatus').val(thisProjectObject.status)
    $('#updateProject fieldset textarea#editinputProjectReference').val(thisProjectObject.reference)
    $('#updateProject fieldset input#editinputProjectTags').val(thisProjectObject.tags)
    $('#updateProject fieldset input#editinputProjectUrl').val(thisProjectObject.url)

    $('#btnUpdateProject').attr('rel', thisProjectName)


    $('#updateProject').toggle();
};
