const consumerKey = import.meta.env.VITE_DISCOGS_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET;
const baseURL = 'https://api.discogs.com/';
const artistId = 10995;
const year = 1999
const artistRole = "Written-by" // doesn't work
const perPage = 100;
import stringToQuery from "./stringToQuery";
const sortByYearHundredPerPage = "?sort=year&sort_order=asc&per_page=100"

const credit = "Stephen Bruner"
const type = "master"

const search = `${baseURL}database/search?credit=${stringToQuery(credit)}&type=${type}${sortByYearHundredPerPage}&key=${consumerKey}&secret=${consumerSecret}`
const url = `${baseURL}/artists/${artistId}/releases${sortByYearHundredPerPage}`;

fetch(search)
    .then(response => response.json())
    .then(data => {
        // Handle successful response
        // data.releases will contain an array of releases
        console.log(data);
    })
    .catch(error => {
        // Handle error
        console.error(error);
    });


const SmallTester = () => {
    return(
        <></>
    )
}
export { sortByYearHundredPerPage }
export default SmallTester