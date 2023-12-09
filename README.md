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

```js
fetch(`https://api.discogs.com/database/search?q=${band}&key=${consumerKey}&secret=${consumerSecret}`);
```

Returns a long array of all options.

I need to get the extrartists field. Might only be available through searching by master id.

Need to search this:
<https://www.discogs.com/developers#page:database,header:database-release>
<https://www.discogs.com/forum/thread/401632>

[Query Params](https://www.discogs.com/developers#page:database,header:database-search)
/database/search?q={query}&{?type,title,release_title,credit,artist,anv,label,genre,style,country,year,format,catno,barcode,track,submitter,contributor}

Nirvana master_id: 13814
