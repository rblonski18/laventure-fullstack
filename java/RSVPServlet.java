
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;


@WebServlet("/RSVPServlet")
public class RSVPServlet  extends HttpServlet {

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


    //request for capacity associated with activityid
    //		fetch('LAVenture/RSVPServlet', {
    //			method: 'GET',
    //			headers: {'Content-Type': 'application/json'},
    //			body: JSON.stringify({
    //				activityid: activityID
    //				userid: userID (optional)
    //				task: getCapacity
    //			})
    //		})

    //request for RSVP status for a user
    //		fetch('LAVenture/RSVPServlet', {
    //			method: 'GET',
    //			headers: {'Content-Type': 'application/json'},
    //			body: JSON.stringify({
    //				activityid: activityID
    //				userid: userID
    //				task: checkStatus
    //			})
    //		})


    //Check RSVP status and check capacity of activity
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);
        PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String id = request.getParameter("activityid");
        int activityID = -1;

        try {
            activityID = Integer.parseInt(id);
        }
        catch(NumberFormatException nfe) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Could not parse id parameter.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        String task = request.getParameter("task");
        if(task == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "No task specified.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        else if(task.equals("getCapacity")){
            Integer cap = JDBCConnector.getMaxRSVPs(activityID);
            if(cap == -1) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Activity ID does not exist in database.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            else {
                response.setStatus(HttpServletResponse.SC_OK);
                pw.write(new Gson().toJson(cap));
                pw.flush();
            }
        }
        else if(task.equals("checkStatus")) {
            String username = request.getParameter("username");
            if(username == null || username.equals("")) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "No user specified.";
                pw.write(new Gson().toJson(error));
                pw.flush();
                return;
            }

            Integer status = JDBCConnector.RSVPStatus(activityID, username);
            if(status == -1) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Could not find RSVP.";
                pw.write(new Gson().toJson(error));
                pw.flush();
                return;
            }
            else if(status == -2) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "User is not RSVPed and not in queue.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            else if(status == -100) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "SQL error occured in JDBCConnector.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            else {
                response.setStatus(HttpServletResponse.SC_OK);
                pw.write(new Gson().toJson(status));
                pw.flush();
            }
        }
        else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Invalid task specification.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }
    }

    //Add/Cancel RSVP

    //add RSVP for a user
    //		fetch('LAVenture/RSVPServlet', {
    //			method: 'POST',
    //			headers: {'Content-Type': 'application/json'},
    //			body: JSON.stringify({
    //				activityid: activityID
    //				userid: userID
    //				task: add
    //			})
    //		})


    //cancel RSVP for a user
    //		fetch('LAVenture/RSVPServlet', {
    //			method: 'POST',
    //			headers: {'Content-Type': 'application/json'},
    //			body: JSON.stringify({
    //				rsvpid: RSVPID
    //				task: cancel
    //			})
    //		})

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);
    	PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        
        String payloadRequest = BodyReader.getBody(request);
        
        Type type = new TypeToken<HashMap<String, String>>(){}.getType();
        HashMap<String, String> body = new Gson().fromJson(payloadRequest, type);
       
        
        String task = body.get("task");
        if(task == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "No task specified.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        else if(task.equals("cancel")) {
            String rsvp = body.get("rsvpid");
            if(rsvp == null || rsvp.isBlank()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "No RSVPID specified.";
                pw.write(new Gson().toJson(error));
                pw.flush();
                return;
            }
            Integer RSVPID = null;
            try {
                RSVPID = Integer.parseInt(rsvp);
            }
            catch(NumberFormatException nfe) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Invalid RSVPID.";
                pw.write(new Gson().toJson(error));
                pw.flush();
                return;
            }

            boolean removed = JDBCConnector.cancelRSVP(RSVPID);
            if(!removed) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Error removing RSVPID.";
                pw.write(new Gson().toJson(error));
                pw.flush();
                return;
            }
            else {
                response.setStatus(HttpServletResponse.SC_OK);
                String success = "Successfully removed RSVP";
                pw.write(new Gson().toJson(success));
                pw.flush();
                return;

            }

        }

        else if(task.equals("add")){
            String id = body.get("activityid");
            int activityID = -1;

            try {
                activityID = Integer.parseInt(id);
            }
            catch(NumberFormatException nfe) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "Could not parse id parameter.";
                pw.write(new Gson().toJson(error));
                pw.flush();
                return;
            }

            String username = body.get("username");
            if(username == null || username.isBlank()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "No user specified.";
                pw.write(new Gson().toJson(error));
                pw.flush();
                return;
            }

            Integer status = JDBCConnector.addRSVP(activityID, username);
            if(status == -1) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "User is RSVPed but not in queue.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            else if(status == -100) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                String error = "SQL error occured in JDBCConnector.";
                pw.write(new Gson().toJson(error));
                pw.flush();
            }
            else {
                response.setStatus(HttpServletResponse.SC_OK);
                pw.write(new Gson().toJson(status));
                pw.flush();
            }
        }
        else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Invalid task specification.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }
    }

}
