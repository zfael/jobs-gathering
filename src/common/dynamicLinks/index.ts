import axios from "axios";
import config from "../../config";

const {
  firebase: {
    apikey,
    dynamicLink: { domainUriPrefix }
  }
} = config;

const URL = `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=${apikey}`;
const socialImageLink =
  "https://lh3.googleusercontent.com/-Xu5mGuINxuI/XcOTTZDDp9I/AAAAAAAAAAs/uOWkIMxLfa4pQnSOhBwJRpNnvybMW_aGACEwYBhgL/w140-h140-p/jobbeer_logo256.png";
const gplayURL = "https://play.google.com/store/apps/details?id=app.jobbeer.jobbeer_flutter";

const createJobLink = async ({ id, title, description }) => {
  const result = await axios.post(URL, {
    dynamicLinkInfo: {
      domainUriPrefix,
      link: `${gplayURL}&job=${id}`,
      androidInfo: {
        androidPackageName: "app.jobbeer.jobbeer_flutter",
        androidFallbackLink: "https://play.google.com/store/apps/details?id=app.jobbeer.jobbeer_flutter",
      },
      socialMetaTagInfo: {
        socialTitle: title,
        socialDescription: description,
        socialImageLink
      }
    }
  });

  return result.data.shortLink;
};

export default { createJobLink };
