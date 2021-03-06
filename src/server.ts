import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import Jimp from 'jimp';
import validUrl from 'valid-url';
import {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} from 'http-status-codes';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1

  
  //RESTFUL ENDPOINT GET /filteredimage?image_url={{URL}} endpoint to filter an image from a public url
  app.get("/filteredimage/", async (req: express.Request, res:express.Response) => {
    const imageUrl: string = req.query.image_url;

    //Validation to check if image url is present
    if (!imageUrl) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        message: "Image url is required"
      });
    }

    //Validation to check if query param is a valid url
    if(!validUrl.isUri(imageUrl)){
      return res.status(StatusCodes.UNSUPPORTED_MEDIA_TYPE).send({error:'Invalid url'});
    }


    try {
      console;
      const filteredImagePath: string = await filterImageFromURL(imageUrl);
      res.sendFile(filteredImagePath, () => deleteLocalFiles([filteredImagePath]));
    } catch (error) {
      res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY).send("Unable to process image");
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req: express.Request, res:express.Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();