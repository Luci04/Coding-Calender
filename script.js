
const windowLocalSorage = window.localStorage;

var mappping = [];

var selctedSites = [];

// const Default_selected = windowLocalSorage.getItem("codher_calander");

function handleClick(index) {
    const temp = selctedSites.findIndex((ele) => ele === index);

    if (temp != -1) {
        selctedSites = selctedSites.filter((ele) => ele !== index);
        return;
    }

    windowLocalSorage.setItem('selctedSites', selctedSites);
}

const sites_list = async () => {
    const response = await fetch('https://kontests.net/api/v1/sites')

    const data = await response.json();
    console.log(data);

    if (!response) {
        return
    }

    let ele = document.getElementById("todo-cmp__list");

    let listing = "";

    data.map((e, index) => {
        const temp = selctedSites.findIndex((ele) => ele === index);
        listing +=
            `<li>
				<label for="todo-${index}">
					<input   id="todo-${index}" ${temp !== -1 ? 'checked' : ""}  type="checkbox">
					<span onclick='handleClick(${index})' >
                        <a>${e[0]}</a>
                    </span>
				</label>
			</li>`
        mappping[index] = e[0];
    })
    ele.innerHTML = listing
}

const TimeDifference = (timeStart, timeEnd) => {
    timeEnd = new Date(timeEnd)
    timeStart = new Date(timeStart)

    var diffHrs = timeEnd.getHours() - timeStart.getHours();
    var diffMins = timeEnd.getMinutes() - timeStart.getMinutes();

    diffHrs += Math.round(diffMins / 60);

    diffMins = diffMins % 60;
    return diffHrs + ':' + diffMins;
};


const fetch_contest = async () => {
    const response = await fetch('https://kontests.net/api/v1/all')

    if (!response) {
        return
    }
    const data = await response.json();

    console.log(data);

    let ele = document.getElementById("contest-list");

    let listing = "";
    var time = new Date;

    data.map((e, index) => {

        listing +=
            `<li class="box">
            <span></span>
            <div class="title"><a target='_blank'  href="${e.url}">${e.name}</a> </div>
            <div class="sub-title">contest at ${e.site}</div>
            <div class="time">
                <span>${e.start_time}</span>
                <span>${e.end_time}</span>
            </div>
        </li>`
        mappping[index] = e[0];
    })
    ele.innerHTML = listing
}



// sites_list();
fetch_contest();
