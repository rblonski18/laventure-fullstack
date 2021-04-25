
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


//request for list of activities sorted in some way
//fetch('LAVenture/ActivityListServlet', {
//	method: 'GET',
//	headers: {'Content-Type': 'application/json'},
//	body: JSON.stringify({
//		sortBy: none/rating/recently viewed,
//		user: username
//	})
//})

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
    //	-TODO: Need to make sure that HeapSort is being called correctly and returning in the right order
    //"recently viewed" will return a list of recently viewed activities for the specified user
    //	-TODO: Need a database function
    //	-NOTE: This section of code should still run, but it returns a placeholder JSON string and makes
    //			no attempt to access the database.
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);
        PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        
        
        String payloadRequest = BodyReader.getBody(request);
        
        Type type = new TypeToken<HashMap<String, String>>(){}.getType();
        HashMap<String, String> body = new Gson().fromJson(payloadRequest, type);
       

        String sortBy = body.get("sortBy");
        String user = body.get("user");

        if(sortBy == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Missing sortBy parameter.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        ArrayList<Activity> activities = JDBCConnector.getActivities();

        //return all activities in the database (default list)
        if(sortBy.equals("none")) {
            response.setStatus(HttpServletResponse.SC_OK);
            String activitiesJSON = new Gson().toJson(activities);
            pw.write(activitiesJSON);
            pw.flush();
        }
        //return a list of activities sorted by their rating
        else if(sortBy.equals("rating")) {
            HeapSort.sort(activities, true);
            response.setStatus(HttpServletResponse.SC_OK);
            String activitiesJSON = new Gson().toJson(activities);
            pw.write(activitiesJSON);
            pw.flush();
        }
        //TODO
        //return a list of activities that were recently viewed by the specified user
        else if(sortBy.equals("recently viewed")) {
            if(user == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Missing user parameter.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            else {
                String placeholder = "Recently viewed sorting not implemented yet!";
                response.setStatus(HttpServletResponse.SC_ACCEPTED);
                pw.write(new Gson().toJson(placeholder));
                pw.flush();
            }
        }
        //OTHERWISE, invalid command
        else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Invalid sortBy parameter.";
            pw.write(new Gson().toJson(error));
            pw.flush();
        }

    }
}
