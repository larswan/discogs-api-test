# Discog API Mini-Project

This is a project for testing out the Discog API to help me refine the scope of a larger project I want to use it on.

[API Docs](https://www.discogs.com/developers)

[Node Module](https://github.com/bartve/disconnect)

Request Token URL <https://api.discogs.com/oauth/request_token>
Authorize URL <https://www.discogs.com/oauth/authorize>
Access Token URL <https://api.discogs.com/oauth/access_token>

```bash
npm install disconnect
```

## Basic Search

Search for a release:

```js
fetch(`https://api.discogs.com/database/search?q=${band}&key=${consumerKey}&secret=${consumerSecret}`);
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
        }
    ]
    }]
year: num,
```

## Hmm

Need to search this:
<https://www.discogs.com/developers#page:database,header:database-release>
<https://www.discogs.com/forum/thread/401632>
