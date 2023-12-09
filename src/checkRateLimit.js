const checkRateLimit = (req) => {

    if (req.headers.has('X-Discogs-Ratelimit')) {
        const totalRequests = req.headers.get('X-Discogs-Ratelimit');
        const usedRequests = req.headers.get('X-Discogs-Ratelimit-Used');
        const remainingRequests = req.headers.get('X-Discogs-Ratelimit-Remaining');

        console.log('Rate Limit Information:');
        console.log(`Total Requests: ${totalRequests}`);
        console.log(`Used Requests: ${usedRequests}`);
        console.log(`Remaining Requests: ${remainingRequests}`);
    }
    else{
        console.log("Error showing rate limit")
    }
}

export default checkRateLimit