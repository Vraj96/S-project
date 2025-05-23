console.log('lets write javascript');
let currentsong = new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) { // જો seconds નંબર નથી (isNaN) કે પછી 0 કરતાં નાનું છે, તો ચેક કરે છે.
        return "00:00"; // જો ઇનપુટ ખોટું હોય, તો "00:00" રિટર્ન કરે છે.
    }

    const minutes = Math.floor(seconds / 60); //seconds ને 60 થી ભાગીને મિનિટ બનાવે છે.
    // Math.floor() દશાંશ (decimal) ભાગ દૂર કરે છે.
    const remainingSeconds = Math.floor(seconds % 60); // % નો ઉપયોગ કરીને બાકી રહેલા સેકન્ડ્સ (જેમ કે 75 % 60 = 15) મેળવે છે.

    const formattedMinutes = String(minutes).padStart(2, '0'); // મિનિટને string માં બદલે છે અને જો તે 10 કરતાં નાનું હોય તો આગળ 0 ઉમેરે છે. like 02
    const formattedSeconds = String(remainingSeconds).padStart(2, '0'); // તે જ રીતે સેકન્ડ્સ માટે પણ આગળ 0 ઉમેરે છે, જેમ કે "09".

    return `${formattedMinutes}:${formattedSeconds}`; // "MM:SS" ફોર્મેટમાં મિનિટ અને સેકન્ડ્સને જોડે છે અને પાછું આપે છે.
}

async function getsongs(folder) { // ફોલ્ડરમાંથી ગીત લોડ કરવા માટેની ફંક્શન છે
    currfolder = folder; // હાલનું ફોલ્ડર currfolder માં સેવ કરે છે.
    let a = await fetch(`public/${folder}/`) // ફોલ્ડરનું ડેટા (જેમ કે HTML ફોર્મેટમાં ફાઈલો) સર્વર પરથી લાવે છે.
    let response = await a.text(); // ફોલ્ડરનો જવાબ ટેક્સ્ટ (HTML) રૂપે લેશે.
    let div = document.createElement("div") // એક નવું div એલિમેન્ટ બનાવે છે (સ્ક્રીન પર દેખાતું નથી). Dom
    div.innerHTML = response; // આ divમાં સર્વરથી મળેલું HTML મૂકે છે.
    let as = div.getElementsByTagName("a") // divમાંથી બધા <a> લિન્કો (અંકર ટેગ) લાવે છે.
    songs = [] // ગીતોની યાદી માટે ખાલી songs લિસ્ટ બનાવે છે.
    for (let index = 0; index < as.length; index++) { // આ લૂપ as એરેના દરેક آئટમ પર જાય છે. લૂપ 0 થી શરૂ થાય છે અને છેલ્લી એન્ટ્રી સુધી ચાલે છે.
        const element = as[index]; // અમે as એરેમાંથી વર્તમાન તત્વને element નામના ચલ (variable) માં મૂકી રહ્યા છીએ.
        if (/\.(mp3|mp4|mp2|m4a)$/i.test(element.href)) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        } // આ લાઇન ચેક કરે છે કે element.href નો અંત .mp3, .mp4, .mp2, અથવા .m4a પર થાય છે કે નહીં. i નો અર્થ કે નાના કે મોટા અક્ષરો હોવા છતાં મેચ થશે.
    }


    // Show all the song in playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0] // .songlist ક્લાસ વાળું એલીમેન્ટ શોધે છે. એની અંદરનું પહેલું <ul> લે છે — એટલે જેણે બધા ગીતો બતાવવાના છે. એને songul નામના વેરિઅબલમાં રાખે છે.
    songul.innerHTML = "" // પહેલાથી <ul> અંદર જો કંઈ પણ હોય, તો ખાલી કરી દે છે. હવે નવું ગીત લિસ્ટ ઉમેરવાનું છે.
    for (const song of songs) { // songs એરેમાં જેટલા ગીતો છે, દરેક માટે લૂપ ચાલે છે. song દરેક વખતનું એક ગીતનું નામ છે (જેમ કે "song1.m4a").
        songul.innerHTML = songul.innerHTML + `<li><img class="invert" width="34" src="img/music.svg" alt=""> 
                                  <div class="info">
                                      <div> ${song.replaceAll("%20", "")}</div>
                                      <div>vraj</div>
                                  </div>
                                  <div class="playnow">
                                      <span>Play Now</span>
                                      <img class="invert" src="public/img/play.svg" alt="">
                                  </div></li>`;
        // નવી HTML લાઈન <ul>માં ઉમેરે છે — દરેક ગીત માટે એક <li> બનાવે છે.

    }

    // Attach an event listener to echa song

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => { // array.form ni helpe this list na arry ma badla che ja thi tana paer loop chala vi shakya // forEach e દરેક ગીતનો mata loop chala va che // e દરેક ગીતનો <li> એલીમેન્ટ છે.
        e.addEventListener("click", element => {
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        }) // ક્લિક કરેલા ગીતમાં .info ક્લાસવાળું ડિવ શોધે છે.// એની અંદરનું પહેલું <div> એ ગીતનું નામ આપે છે.// .trim() વડે નામની આગળ-પાછળની ખાલી જગ્યા દૂર કરે છે.// પછી playMusic() ફંક્શનને ગીતનું નામ આપે છે જેથી ગીત વગાડી શકાય.
    })

    return songs

}


const playMusic = (track, pause = false) => { // તે બે arguments લે છે: track: ગીતનું નામ pause: જો true હોય તો ગીત રમશે નહીં, false હોય તો તરત ચાલુ થશે.
    currentsong.src = `public/${currfolder}/` + track // ગીતના ફોલ્ડર અને નામને મળાવીને audio player માટે source (src) સેટ કરે છે.
    if (!pause) { // જો pause false છે (અર્થાત ગીત વગાડવું છે), તો નીચેનું કોડ ચાલશે.
        currentsong.play() // play song
        play.src = "public/img/pause.svg" // પ્લે બટનનો icon બદલે છે, હવે પોઝ દેખાશે જેથી યૂઝરને ખબર પડે કે ગીત ચાલી રહ્યું છે.
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track) // .songinfo માં ગીતનું નામ બતાવે છે. decodeURI નો ઉપયોગ કરીને %20 ને space માં બદલે છે.
    document.querySelector(".songtime").innerHTML = " 00:00 / 00:00 "


}

async function displayAlbums() { // folderમાં રહેલા ગીતો) પેજ પર બતાવે છે.
    let a = await fetch(`/public/songs/`) // songs maa thi data lava che 
    let response = await a.text(); // text maa show kara che
    let div = document.createElement("div")
    div.innerHTML = response;// એક virtual <div> બનાવે છે અને તેમાં fetched HTML નાખે છે, જેથી એમાંથી folders શોધી શકાય.
    let anchors = div.getElementsByTagName("a") // બધા anchor (<a>) ટેગ લાવે છે, જે folders ની લિંક છે.
    let cardcontainer = document.querySelector(".cardcontainer") // એ ડિવ શોધે છે, જ્યાં albums show કરવાનું છે.
    let array = Array.from(anchors) // anchor list ને JavaScript arrayમાં બદલે છે, જેથી loop ચલાવી શકાય.
    for (let index = 0; index < array.length; index++) { // દરેક anchor પર forલૂપ ચલાવે છે.
        const e = array[index];
        if (e.href.includes("/songs/") && !e.href.includes(".htaccess")) { // ફક્ત /songs/ મા હોય અને .htaccess ફાઇલ ન હોય એવી ફોલ્ડર લિંક પર આગળ વધે છે.
            let folder = e.href.split("/").slice(-2)[1] // ફોલ્ડરનું નામ લિંકમાંથી કાઢે છે.
            // Get the metadata of the folder
            let a = await fetch(`public/songs/${folder}/info.json`)
            let response = await a.json(); // ફોલ્ડરનું info.json લાવે છે અને તેને object (JSON) માં બદલે છે.
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}" class="card ">
                        <div  class="play">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                xmlns="http:// www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141834" stroke-width="1.5" fill="#000"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/public/songs/${folder}/cover.jpg"
                            alt="image">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
            // ફોલ્ડર માટે card બનાવે છે જેમાં albumnu image (cover.jpg), title અને description બતાવાય છે.
        }
    }

    // load the playlist whenever card is clicked 
    Array.from(document.getElementsByClassName("card")).forEach(e => { // badha crad na lava che and tana array maa badli na loop run kara che  
        e.addEventListener("click", async item => { // જ્યારે card પર click થાય ત્યારે async function ચાલશે.
            console.log("Fetching Songs")
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`) // getsongs() functionને બોલાવીને તે ફોલ્ડર પરથી ગીત લાવો.//ફોલ્ડરનું નામ data-folder attribute માંથી મળે છે.//await એટલે કે ગીતો fully લોડ થાય ત્યાં સુધી રાહ જુવો.
            playMusic(songs[0]) // song na play karva nu kame kara che 

        })
    })
}


async function main() {
    // get the list of all songs 
    await getsongs("songs/ncs")
    playMusic(songs[0], true)

    // Display All The Albums On The Page 
    await displayAlbums()

    // Attach an event listener to play, next and previous

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "public/img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "public/img/play.svg"
        }
    })

    // Listen for timeupdate event 
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"; // sike bar upar hu song na aagal vadharu to ta Prama na time update tya che 
    })

    // add event listener to seekbar 

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100

    })

    // add event listener  for hamburger

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // add event listener  for close button

    document.querySelector(".x").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add event listener  to previous 

    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]) // હાલમાં જે ગીત વાગે છે, એનું નામ કાઢી ને તે ગીત songs લિસ્ટમાં ક્યા નંબર પર છે (index) એ શોધે છે.
        if ((index - 1) >= 0) { // જો પેલા નંબર પર ગીત હોય (index - 1 >= 0) તો આગળ વધે છે. નહીંતર એ પહેલા ન જઈ શકે, એટલે ચેક કરે છે.
            playMusic(songs[index - 1]) //લિસ્ટમાંથી પેલા ગીતનું નામ લઇને playMusic() ફંક્શન વડે એને વગાડે છે.
        }
    })



    // Add an event listener to next
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]) // હાલ જે ગીત વગાડી રહ્યા છીએ, એનું નામ લયે છે અને songs લિસ્ટમાં કયા નંબર પર છે એ શોધે છે.
        if ((index + 1) < songs.length) { // ચેક કરે છે કે અગળ બીજું ગીત છે કે નહીં. જો છે તો આગળ વધે છે.
            playMusic(songs[index + 1]) // songs લિસ્ટમાંથી આગળનું (next) ગીત વગાડે છે.
        }
    })

    // add a event to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => { // જયારે slider ની value બદલાય (user volume બદલે), ત્યારે આ ફંક્શન ચાલે છે.
        console.log("Setting volume to", e.target.value, "/ 100")
        currentsong.volume = parseInt(e.target.value) / 100 //Volume slider ની value (e.g., 40) ને 0.0 થી 1.0 વચ્ચે બદલવામાં આવે છે.પછી એ value(song) ના volume તરીકે સેટ થાય છે.
        if (currentsong.volume > 0) { // જો volume 0 કરતા વધુ છે (અર્થાત ગીત mute નથી), તો…
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg") // તો icon “mute” થી “volume” માં બદલાય છે (જેમ કે speaker on).
        }
    })

    // add a event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })







}

main()