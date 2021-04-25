
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

@WebServlet("/ReviewsServlet")
public class ReviewsServlet  extends HttpServlet {
	
	  @Override
	  protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
	          throws ServletException, IOException {
	      setAccessControlHeaders(resp);
	      resp.setStatus(HttpServletResponse.SC_OK);
	  }

	  private void setAccessControlHeaders(HttpServletResponse resp) {
	      resp.setHeader("Access-Control-Allow-Origin", "*");
	      resp.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	      resp.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	      
	  }

    private static final long serialVersionUID = 1L;

    //request for all reviews associated with activityid
    //		fetch('LAVenture/ReviewsServlet', {
    //			method: 'GET',
    //			headers: {'Content-Type': 'application/json'},
    //			body: JSON.stringify({
    //				isRSVP: false,
    //				activityid: activityID
    //			})
    //		})

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);
        PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String id = request.getParameter("activityid");
        if(id == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Missing id parameter.";
            pw.write(new Gson().toJson(error));
            pw.flush();
        }
        else {
            int activityID = -1;
            try {
                activityID = Integer.parseInt(id);
            }
            catch(NumberFormatException nfe) {
                activityID = -1;
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Could not parse id parameter.";
                pw.write(new Gson().toJson(error));
                pw.flush();
                return;
            }
            //the JDBC getReviews function doesn't check if the ID actually exists in the database
            //(which may not be a problem depending on how the front-end works), so this servlet
            //should just return an empty ArrayList if the ID is invalid
            ArrayList<Review> reviews = JDBCConnector.getReviews(activityID);
            response.setStatus(HttpServletResponse.SC_OK);
            String reviewsJSON = new Gson().toJson(reviews);
            pw.write(reviewsJSON);
            pw.flush();
        }
    }


    //request to add new review
    //fetch('LAVenture/ReviewsServlet'),{
    //		method:'POST',
    //		headers:{'Content=Type': 'application/json'},
    //		body: JSON.stringify({
    //			activityid: activityID
    //			reviewtext: reviewText
    //			rating:	rating
    //			userid: userID
    //		})
    //}
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);
    	PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String aID = request.getParameter("activityid");
        String uID = request.getParameter("userid");
        String reviewText = request.getParameter("reviewtext");
        String rating = request.getParameter("rating");

        //Assuming for now that all the parameters are required
        //That may not be the case if we let a user leave a star rating with a blank review
        if(aID == null || uID == null || reviewText == null || rating == null) {
            String error = "Missing one or more parameters.";
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        int activityID = -1;
        int userID = -1;
        double ratingVal = -1.0;

        try {
            activityID = Integer.parseInt(aID);
            userID = Integer.parseInt(uID);
            ratingVal = Double.parseDouble(rating);
        }
        catch(NumberFormatException nfe) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Could not parse one or more parameters.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        JDBCConnector.addReview(activityID, userID, ratingVal, reviewText);
        String success = "Successfully added review to database";
        response.setStatus(HttpServletResponse.SC_OK);
        pw.write(new Gson().toJson(success));
        pw.flush();


    }
}
