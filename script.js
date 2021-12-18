const windowLocalSorage = window.localStorage;
let in_24_contest = [];
let currently_running_contest = [];
var mappping = [];
var All_data;
var selctedSites = [];

chrome.storage.sync.get(['selected_sites'], function (result) {
    selctedSites = JSON.parse(result.selected_sites);
});


document.getElementById('next_24_hour').onclick = function () {

    in_24_contest = collecting_24_hour_contest(All_data);

    var element1 = document.getElementById('frame');
    element1.style.display = "none"

    var element2 = document.getElementById('contest-list');
    element2.style.display = "block"

    let ele = document.getElementById("contest-list");
    console.log(in_24_contest)
    var listing = "";

    in_24_contest.map((e) => {
        listing += default_structure(e);
    })

    setting_html(listing, ele);
}

document.getElementById("listing_sites").onclick = function () {
    var element1 = document.getElementById('frame');
    element1.style.display = "block"
    var element2 = document.getElementById('contest-list');
    element2.style.display = "none"
    sites_list();
}


document.getElementById('running_contest').onclick = function () {

    currently_running_contest = collecting_current_running_contest(All_data);

    var element1 = document.getElementById('frame');
    element1.style.display = "none"

    var element2 = document.getElementById('contest-list');
    element2.style.display = "block"

    let ele = document.getElementById("contest-list");
    console.log(currently_running_contest)
    var listing = "";

    currently_running_contest.map((e) => {
        listing += default_structure(e);
    })

    setting_html(listing, ele);
    console.log(listing)
}






// const Default_selected = windowLocalSorage.getItem("codher_calander");



function set_onClick_elevery_site(data) {
    data.forEach((ele, index) => {
        document.getElementById(ele[0]).onclick = function () {
            const temp = selctedSites.findIndex((ele) => ele.Index === index);

            if (temp != -1) {
                selctedSites = selctedSites.filter((ele) => ele.Index !== index);

                chrome.storage.sync.set({ 'selected_sites': selctedSites }, function () {
                    console.log('Saved');
                });
                return;
            }
            // console.log(mappping[index]);
            let obj = { "Index": index, "Site": mappping[index] }
            selctedSites.push(obj)

            chrome.storage.sync.set({ 'selected_sites': JSON.stringify(selctedSites) }, function () {
                console.log('Saved');
            });

            console.log(selctedSites);
        };
    })

}

const sites_list = async () => {

    document.getElementById("today_date").innerHTML = (new Date()).toLocaleDateString('en-GB');

    const response = await fetch('https://kontests.net/api/v1/sites')

    if (!response) {
        return;
    }

    const data = await response.json();
    console.log(data);


    let ele = document.getElementById("todo-cmp__list");

    let listing = "";
    console.log((selctedSites));
    data.map((e, index) => {
        var temp = selctedSites.find((ele) => ele.Index === index);
        listing +=
            `<li>
				<label for="todo-${index}">
					<input   id="todo-${index}" ${temp ? "checked" : ""}  type="checkbox">
					<span id='${e[0]}'>
                        <a>${e[0]}</a>
                    </span>
				</label>
			</li>`
        mappping[index] = e[0];
    })

    setting_html(listing, ele);
    set_onClick_elevery_site(data);

}


function collecting_24_hour_contest(data) {
    data = filter_data_selected_sites(data);
    let x = data.filter((e) => e.in_24_hours !== 'No')
    return x;
}


function collecting_current_running_contest(data) {
    data = filter_data_selected_sites(data);
    let x = data.filter((e) => e.status === 'CODING')
    return x;
}

function formatAMPM(date) {
    date = new Date(date);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function format_date(d) {
    d = new Date(d)
    d = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()
    return d;
}


function default_structure(e) {
    return `<li class="box">
    <span></span>
    <div class="title"><a target='_blank'  href="${e.url}">${e.name}</a> </div>
    <div class="sub-title">contest at ${e.site}</div>
    <div class="time">
        <span>${formatAMPM(e.start_time)}</span>
        <span>${formatAMPM(e.end_time)}</span>
    </div>
    <div class="time2">
    <span>Start : ${format_date(e.start_time)}</span>
    <br>
    <span>End : ${format_date(e.end_time)}</span>
</div>
</li>`
}


function setting_html(data, ele) {
    ele.innerHTML = data;
}

function filter_data_selected_sites(data) {
    data = data.filter((e) => selctedSites.findIndex((ref) => ref.Site === e.site) !== -1);
    return data;
}

const fetch_contest = async () => {

    document.getElementById("frame").style.display = "none";

    const response = await fetch('https://kontests.net/api/v1/all')

    if (!response) {
        return;
    }

    All_data = await response.json();

    console.log(selctedSites.length);
    if (selctedSites.length !== 0) {
        var element2 = document.getElementById('contest-list');
        element2.style.display = "block"
        console.log(All_data);

        var element1 = document.getElementById('frame');
        element1.style.display = "none"


        in_24_contest = collecting_24_hour_contest(All_data);

        var element1 = document.getElementById('frame');
        element1.style.display = "none"

        var element2 = document.getElementById('contest-list');
        element2.style.display = "block"

        let ele = document.getElementById("contest-list");
        console.log(in_24_contest)
        var listing = "";

        in_24_contest.map((e) => {
            listing += default_structure(e);
        })

        setting_html(listing, ele);


    } else {
        document.getElementById("frame").style.display = "block";
        sites_list();
    }


}

fetch_contest();

