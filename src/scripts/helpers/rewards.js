function rewardStatus() {
    // Reward scans set to 1 by default, reward revealed once 2 scans reached
    if (sessionStorage.rewardScans) {

        if (sessionStorage.rewardScans == 1) {

            sessionStorage.setItem("rewardScans", 2);
            $('#reward').addClass('reward-active');


        } else {

            sessionStorage.setItem("rewardScans", 1);
            $('#reward').removeClass('reward-active');

        }

    } else {

        sessionStorage.setItem("rewardScans", 1);
        $('#reward').removeClass('reward-active');

    }

    var rewardScans = sessionStorage.getItem("rewardScans");
    
    $('.scan-total').html(rewardScans);
}

function previousRewards(rewards) {

    var rewardsList = JSON.parse(rewards);

    $.each(rewardsList, function(index, element) {

        var list = $('<li></li>');

        $('#reward .historic-rewards').append(list);
        list.append('<span class="icon"><i class="mdi mdi-trophy-variant"></i></span>');
        list.append('<span class="prod-list-name">' + element.title + '</span>');
        list.append('<span class="prod-list-price">' + element.date + '</span>');

    });
    
}