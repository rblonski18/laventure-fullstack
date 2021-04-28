
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

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
            ArrayList<Review> reviews = JDBCConnector.getReviews(activityID);
            response.setStatus(HttpServletResponse.SC_OK);
            String reviewsJSON = new Gson().toJson(reviews);
            pw.write(reviewsJSON);
            pw.flush();
        }
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);
    	PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        
        String payloadRequest = BodyReader.getBody(request);
        
        Type type = new TypeToken<HashMap<String, String>>(){}.getType();
        HashMap<String, String> body = new Gson().fromJson(payloadRequest, type);
       
        
        
        String aID = body.get("activityid");
        String username = body.get("username");
        String reviewText = body.get("reviewtext");
        String rating = body.get("rating");

        if(aID == null || username == null || reviewText == null || rating == null) {
            String error = "Missing one or more parameters.";
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        int activityID = -1;
        double ratingVal = -1.0;

        try {
            activityID = Integer.parseInt(aID);
            ratingVal = Double.parseDouble(rating);
        }
        catch(NumberFormatException nfe) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Could not parse one or more parameters.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        JDBCConnector.addReview(activityID, username, ratingVal, reviewText);
        String success = "Successfully added review to database";
        response.setStatus(HttpServletResponse.SC_OK);
        pw.write(new Gson().toJson(success));
        pw.flush();


    }
}
