const searchArtistById = async (artistId) => {
    try{
        let req = await fetch(`https://api.discogs.com/artists/${artistId}`)
        let res = await req.json()
        console.log("Successful search by artist id: ")
        console.log(res)
        return res
    } catch (error) {
        console.error("Error searching artist by id: ", error)
        throw error
    }
}

export {searchArtistById}