# Discog API Mini-Project

This is a project for testing out the Discog API to help me refine the scope of a larger project I want to use it on.

## Feature List

Allow people to select their streaming service. Save in cookie so that it remains on refresh.

For each song:

1. X versions of this song icon
2. X musicians icon
3. X writers icon
4. X producers icon

Once any individual contributor is clicked:

1. List out albums in a row with their contributions "\_**\_ played bass on \_\_\_\_**"
2. Clicking the album will play a preview of the song/album in your browser through (?)
3. Clicking a play icon on the art will open it in your streaming service
4. Clicking the plus sign will

History:
An icon in the top right will show your history and path, allowing you to click back through to any point
EX: New American Badu Pt. 2 (art) > Stephen Bronner (bass icon) > Them Changes (Art) > Ludwig (producer)

## Test Case

Turn Me Away (Get Munny): extraartists: [name: "Stephen Bruner", role: Bass, id: 1573878]
vs Thundercat (id: 1800656)
Want to get Thundercat and Stephen Bruner results

## Links

[API Docs](https://www.discogs.com/developers)

[Node Module](https://github.com/bartve/disconnect)

[Request Token URL](https://api.discogs.com/oauth/request_token)

[Authorize URL](https://www.discogs.com/oauth/authorize)

[Access Token URL](https://api.discogs.com/oauth/access_token)

## Checklist

[X] String to url function

[X] Highlight tracks with additional artists

[X] Show extraartists

[O] Is search credit="Stephen Bruner" the same as artists/id/releases

- Search credit = stephen bruner type: release/master (both 502 items)

[O] Make list of extraasrtist roles

## Basic Search

[Params](https://www.discogs.com/developers/#page:database,header:database-search)

Search for a release:

```js
fetch(
  `https://api.discogs.com/database/search?q=${query}&type=${type}&key=${consumerKey}&secret=${consumerSecret}`
);
```

Returns a long array of all options. To only get master releases make type=master.

## Search by type

[Query Params](https://www.discogs.com/developers#page:database,header:database-search)
/database/search?q={query}&{?type,title,release_title,credit,artist,anv,label,genre,style,country,year,format,catno,barcode,track,submitter,contributor}

## Search masters by id

Search by "Nevermind" by master id: <https://api.discogs.com/masters/13814>

Returns:

```js
artists[ {
    id: num,
    name: "Nirvana",
    role: "",
    tracks: "",
}],
tracklist[{
    title: "Something In The Way",
    extraartists: [
        {
            id: num,
            name: "Kirk Canning",
            role: "Cello",
            tracks: "",
        },
        {
            anv: "Page", // whats this? Only rarely appears
            id: 180585,
            join: ""
            name: "Jimmy Page",
            resource_url: "https://api.discogs.com/artists/180585", fetch JSON {
                name,
                id,
                resource_url: "current address..",
                uri: (discogs profile),
                releases_url: "https://api.discogs.com/artists/180585/releases", // the big one
                images: [
                    {
                        "type": "primary",
                        "uri": "", // idk why these are blank
                        "resource_url": "", // also blank
                        "uri150": "",
                        "width": 600,
                        "height": 400
                    },
                ]
                realname: "James Patrick Page",
                profile: "short bio description",
                urls: [links to wiki etc],
                namevariations: [array of diff spellings],
                aliases: [
                        {
                            "id": 846559, // different id, good place to look
                            "name": "S. Flavius Mercurius",
                            "resource_url": "https://api.discogs.com/artists/846559"
                        }
                ]
                groups: [
                        {
                            "id": 220763,
                            "name": "The Honeydrippers",
                            "resource_url": "https://api.discogs.com/artists/220763", // All this stuff ^^
                            "active": true
                        },
                    ] }
            role: "Written-By",
            tracks: "",
        }
    ]
    }]
year: num,
```

## Artist Releases

GET /artists/{artist_id}/releases{?sort,sort_order}

[Example Thundercat Releases Ascending by Year](https://api.discogs.com/artists/1800656/releases?sort=year&sort_order=asc`;)
