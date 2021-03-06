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

@WebServlet("/ActivityListServlet")
public class ActivityListServlet extends HttpServlet{

	  /**
	 *
	 */
	private static final long serialVersionUID = 1L;


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

    //doGet handles the three different ways that the front-end wants to access all activities
    //"none" returns a list of all activities without regard to ordering
    //"rating" returns a list of all activities sorted by rating
    //"recent" will return a list of recently viewed activities for the specified user
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);
        PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String sortBy = request.getParameter("sortBy");
        String user = request.getParameter("user");

        if(sortBy == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Missing sortBy parameter.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        ArrayList<Activity> activities = JDBCConnector.getActivities();

        //return a list of activities sorted by their rating
        if(sortBy.equals("rating")) {
            HeapSort.sort(activities, false);
            response.setStatus(HttpServletResponse.SC_OK);
            String activitiesJSON = new Gson().toJson(activities);
            pw.write(activitiesJSON);
            pw.flush();
        }
        //TODO
        //return a list of activities that were recently viewed by the specified user
        else if(sortBy.equals("recent")) {
            if(user == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Missing user parameter.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            else {
                activities = JDBCConnector.getRecentlyViewed(user);
                response.setStatus(HttpServletResponse.SC_OK);
                pw.write(new Gson().toJson(activities));
                pw.flush();
            }
        }
        //OTHERWISE, invalid command
        else {
            response.setStatus(HttpServletResponse.SC_OK);
            String activitiesJSON = new Gson().toJson(activities);
            pw.write(activitiesJSON);
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

        String user = body.get("username");
        String activityid = body.get("activityid");
        
        Integer aID = null;
        try {
        	aID = Integer.parseInt(activityid);
        }
        catch(NumberFormatException nfe) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Could not parse activityid.";
            pw.write(new Gson().toJson(error));
            pw.flush();
        }
        
        if(user == null || user.equals("")) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Username is null or blank.";
            pw.write(new Gson().toJson(error));
            pw.flush();
        }
        
        JDBCConnector.visitActivity(user, aID);
        response.setStatus(HttpServletResponse.SC_OK);
        String success = "User visited activity " + aID;
        pw.write(new Gson().toJson(success));
        pw.flush();
    	
    }
}