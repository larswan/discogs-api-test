import stringToQuery from "../stringToQuery";
const consumerKey = import.meta.env.VITE_DISCOGS_CONSUMER_KEY;
const consumerSecret = import.meta.env.VITE_DISCOGS_CONSUMER_SECRET;

const searchForMasterByName = async (query) => {
    try {
        let req = await fetch(`https://api.discogs.com/database/search?q=${stringToQuery(query)}&type=master&key=${consumerKey}&secret=${consumerSecret}`, {
            headers: {
                'User-Agent': 'YourCustomUserAgent/1.0 +http://yourwebsite.com',
            },
        });
        let res = await req.json();

        console.log("Search results: ")
        console.log(res);

        return res
    } catch (error) {
        console.error('Error fetching search by title:', error);
        throw error;
    }
}

export { searchForMasterByName }