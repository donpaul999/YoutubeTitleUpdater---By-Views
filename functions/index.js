const functions = require('firebase-functions');

const {google} = require('googleapis');

exports.updateVideo = functions.pubsub.schedule('every 2 minutes').onRun(async() => {
    const authClient = new google.auth.OAuth2({
       clientId:'clientIdCode',
       clientSecret:'clientSecretCode',
    });
    authClient.setCredentials({
        refresh_token: 'RefreshTokenCode',
    });

    const youtube = google.youtube({
        auth: authClient,
        version: 'v3',
    });

    const videoId = 'videoIdCode';

    const videoResult = await youtube.videos.list({
        id: videoId,
        part:'snippet, statistics',
    });

    //console.log(JSON.stringify(videoResult, null, 2));

    const{statistics, snippet} = videoResult.data.items[0];

    const newTitle = `Title (Views: ${statistics.viewCount}, Likes: ${statistics.likeCount})`;

    //console.log(newTitle);

    snippet.title = newTitle;

    await youtube.videos.update({
        part: 'snippet',
        requestBody: {
            id: videoId,
            snippet,
        },
    });

    console.log("Everything Done!");
});