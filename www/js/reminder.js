
function addReminder()
{
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var title = document.getElementById("title").value;
    var message = document.getElementById("message").value;

    if(date == "" || time == "" || title == "" || message == "")
    {
      navigator.notification.alert("Please enter all details");
      return;
    }

    var schedule_time = new Date((date + " " + time).replace(/-/g, "/")).getTime();
    schedule_time = new Date(schedule_time);

    var id = info.data.length;

    cordova.plugins.notification.local.hasPermission(function(granted){
      if(granted == true)
      {
        schedule(id, title, message, schedule_time);
      }
      else
      {
        cordova.plugins.notification.local.registerPermission(function(granted) {
            if(granted == true)
            {
              schedule(id, title, message, schedule_time);
            }
            else
            {
              navigator.notification.alert("Reminder cannot be added because app doesn't have permission");
            }
        });
      }
    });
}