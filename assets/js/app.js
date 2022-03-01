/* 
TODO:
-
-
-
-
-
-

*/

/* 1. select all elements which one is needy  */
const surahBody = document.getElementById("surah-body");
const surahListBody = document.getElementById("surah-list-body");
const loader = document.getElementById("loader");
const preloader = document.getElementById("preloader");
const quranHeader = document.getElementById("quran-header");
const searchField = document.getElementById("searchField");

/* 2. create a function for load each surah  */
const loadSurah = async () => {
    loader.classList.add('d-block')
    let response = await fetch(`http://api.alquran.cloud/v1/quran/ar.alafasy`);
    let data = await response.json();
    displaySurahList(data.data.surahs)
}


/* 2.5 work by search terms */
searchField.addEventListener('input', async (event) => {
    loader.classList.add('d-block')
    let searchTerms = event.target.value.toLowerCase();
    let response = await fetch(`http://api.alquran.cloud/v1/quran/ar.alafasy`);
    let data = await response.json();
    let searchedData = data.data.surahs.filter(surah => surah.englishName.toLowerCase().includes(searchTerms));
    if (searchedData.length === 0) {
        surahListBody.querySelector('ul').textContent = 'No Surah found.';
    } else if (event.target.value === '') {
        displaySurahList(data.data.surahs);
    } else {
        displaySurahList(searchedData);
    }

})




/* 3. display surah list in the right side bar  */
const displaySurahList = (allSurah) => {
    surahListBody.querySelector('ul').textContent = '';
    allSurah.forEach((surah) => {
        surahListBody.querySelector('ul').innerHTML += `
                  <li onclick="loadSingleSurah(${surah.number})" class="surah-list list-group-item mb-2 border  list-group-item-action d-flex justify-content-between align-items-center cursor-pointer">${surah.number}. ${surah.englishName} ~ ${surah.name} <i class="bi bi-play-fill"></i></li>`;
    });
    loader.classList.add('d-none')
    /* active list color  */
    const surahList = document.getElementsByClassName('surah-list');
    for (let list of surahList) {
        list.addEventListener('click', () => {
            for (let allList of surahList) allList.classList.remove('active-list');
            list.classList.add('active-list')
        });
    }
}

/* 4. load single surah from api  */
const loadSingleSurah = async (number) => {
    surahBody.querySelector('#quran-body').classList.add('d-flex', 'align-items-center', 'justify-content-center');
    surahBody.querySelector("#quran-body .ayats").textContent = '';
    surahBody.querySelector('h3').style.display = 'none';
    preloader.style.display = 'block';
    let response = await fetch(`http://api.alquran.cloud/v1/quran/ar.alafasy`);
    let data = await response.json();
    let filteredSurah = data.data.surahs.filter(surah => surah.number === number);
    displaySingleSurah(filteredSurah)
}

/* 5. display single surah on ui  */
const displaySingleSurah = (surah) => {
    let {
        number,
        englishName,
        name,
        revelationType,
        ayahs
    } = surah[0];
    quranHeader.innerHTML = `<div class="m-0 d-flex align-items-center justify-content-between">
                                <span class="serial">${number} </span>
                                <h4 class="m-0">[${ayahs.length}] ${englishName} ~ ${name} </h4>
                                <span>Type: ${revelationType} </span>
                            </div>`;


    surah[0].ayahs.forEach(ayat => {
        let {
            juz,
            manzil,
            ruku,
            hizbQuarter,
            sajda
        } = ayat;
        surahBody.querySelector("#quran-body .ayats").innerHTML += `
                                    <li class="list-group-item ayat-item pb-2 mb-3 border">
                                        <p class="text d-flex fs-4 align-items-center justify-content-between p-1 mb-1">
                                            ${ayat.numberInSurah}. ${ayat.text} 
                                            <i onclick="playAyat(this, '${ayat.audio}')" class="cursor-pointer bi bi-play-circle-fill"></i></p>
                                        <div class="info">
                                            <ul class="d-flex list-unstyled">
                                                <li class="small mx-2 badge bg-dark">Ruku: ${ruku}</li>
                                                <li class="small mx-2 badge bg-dark">Sajda: ${sajda ? 'Yes' : 'No'}</li>
                                                <li class="small mx-2 badge bg-dark">Manzil: ${manzil}</li>
                                                <li class="small mx-2 badge bg-dark">HizbQuarter: ${hizbQuarter}</li>
                                                <li class="small mx-2 badge bg-dark">Juz: ${juz}</li>
                                            </ul>
                                        </div>
                                    </li>`;

        surahBody.querySelector('#quran-body').classList.remove('d-flex', 'align-items-center', 'justify-content-center');
        preloader.style.display = 'none';

    })
}

/* 6. play audio for each ayat  */
const playAyat = (target, audio) => {
    const audioElement = document.getElementById("audio");
    const surahList = document.getElementsByClassName('ayat-item');
    audioElement.classList.add('playing');
    audioElement.src = audio;
    audioElement.classList.contains('playing') ? audioElement.play() : '';
    audioElement.onplaying = () => {
        target.classList.remove('bi-play-circle-fill')
        target.classList.add('text-white', 'bi-pause-circle-fill')
        target.parentElement.parentElement.classList.add('active-ayat');
        /* active list color  */
        for (let list of surahList) list.classList.add('disabled-ayat');
    }
    audioElement.onended = () => {
        target.classList.remove('text-white', 'bi-pause-circle-fill')
        target.classList.add('bi-play-circle-fill')
        target.parentElement.parentElement.classList.remove('active-ayat');
        for (let list of surahList) list.classList.remove('disabled-ayat');
    }


}

/* calling additional function here  */
loadSurah();