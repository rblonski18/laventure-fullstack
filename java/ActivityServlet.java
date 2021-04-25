
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.lang.reflect.Type;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

//request for activity with the id of activityid
//fetch('LAVenture/ActivityServlet', {
//	method:'GET',
//	headers: {'Content-Type': 'application/json'},
//	body: JSON.stringify({
//		isRSVP: false,
//		activityid: activityID
//	})
//})


@WebServlet("/ActivityServlet")
public class ActivityServlet extends HttpServlet {
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
            activityID = -1;
        }
        if(activityID == -1) {
            response.setStatus(HttpServletResponse.SC_OK);
            String error = "Could not parse id parameter.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        //Current JDBCConnector class only provides access method for a list of all activities
        //We just take that here and manually search each Activity object for a matching id,
        //and return the serialized Activity
        ArrayList<Activity> activities = JDBCConnector.getActivities();

        boolean validID = false;

        for(int i = 0; i < activities.size(); i++) {
            if(activities.get(i).getActivityID() == activityID) {
                response.setStatus(HttpServletResponse.SC_OK);
                String activityJSON = new Gson().toJson(activities.get(i));
                pw.write(activityJSON);
                pw.flush();
                validID = true;
            }
        }

        if(!validID) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Could not find specified activityID in database.";
            pw.write(new Gson().toJson(error));
            pw.flush();
        }
    }

    //Absorbed functionality from proposed NewActivityServlet (relevant for Stephanie)
    //	fetch('LAVenture/ActivityServlet', {
    //		method:'POST',
    //		headers: {'Content-Type': 'application/json'},
    //		body: JSON.stringify({
    //			title: this.state.title, //string
    //			description: this.state.description, //string
    //			location: this.state.location, // string
    //			categories: this.state.categories, //(list)
    //			latitude: this.state.latitude //double
    //			longitude: this.state.longitude //double
    //			image: this.state.image, //to be stored as BLOB type
    //			rating: this.state.rating, //int between 1 and 5
    //(OPT)		date: this.state.date, //string
    //(OPT)		time: this.state.time, //string
    //(OPT)		capacity: this.state.capacity, //int
    //(OPT)		attending: this.state.attending //boolean if this user will/will not attend
    //		})
    //	})
    //

    //TODO: Handle categories list and date
    //Note: Current JDBCConnector function does not support these parameters--will need to modify both JDBCConnector and this servlet
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        setAccessControlHeaders(response);
    	PrintWriter pw = response.getWriter();
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        String payloadRequest = BodyReader.getBody(request);
        
        Type type = new TypeToken<HashMap<String, String>>(){}.getType();
        HashMap<String, String> body = new Gson().fromJson(payloadRequest, type);

        String title = body.get("title");
        String desc = body.get("description");
        String location = body.get("location");
        String categories_str = body.get("categories");
        String latitude_str = body.get("latitude");
        String longitude_str = body.get("longitude");
        String image = body.get("image");
        String rating_str = body.get("rating");
        String time = body.get("time");
        String capacity_str = body.get("capacity");
        String attending_str = body.get("attending");

        String username = body.get("username");

        //error check non-optional parameters
        if(title == null || desc == null || location == null || categories_str == null ||
                latitude_str == null || longitude_str == null || image == null || rating_str == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Missing one or more required parameters.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        int ratingCount = 0;
        if(rating_str.equals("")) {
            ratingCount = 1;
        }

        //parse list of categories
        //are categories booleans, strings, something else? Easy to change if so
        Gson gson = new Gson();
        Type categoryListType = new TypeToken<ArrayList<String>>(){}.getType();
        ArrayList<String> categories = gson.fromJson(categories_str, categoryListType);

        boolean adventure = categories.contains("Adventure");
        boolean beach = categories.contains("Beach");
        boolean books = categories.contains("Books");
        boolean entertainment = categories.contains("Entertainment");
        boolean exercise = categories.contains("Exercise");
        boolean games = categories.contains("Games");
        boolean music = categories.contains("Music");
        boolean nightLife = categories.contains("NightLife");
        boolean outdoors = categories.contains("Outdoors");
        boolean relax = categories.contains("Relax");
        boolean shopping = categories.contains("Shopping");
        boolean sports = categories.contains("Sports");

        Double latitude = null;
        Double longitude = null;
        Double rating = null;
        Integer capacity = null;

        try {
            latitude = Double.parseDouble(latitude_str);
            longitude = Double.parseDouble(longitude_str);
            rating = Double.parseDouble(rating_str);
            //capacity is
            if(capacity_str != null && !capacity_str.isEmpty()) {
                capacity = Integer.parseInt(capacity_str);
            }
            else {
                capacity = null;
            }
        }
        catch(NumberFormatException nfe) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Could not parse 1 or more parameters";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

        int hostAttending = 0;
        Boolean attending = Boolean.parseBoolean(attending_str);
        if(attending) {
            hostAttending = 1;
        }

        //unfortunately Andrew may need to change the function signatures in the JDBCConnector class
        //to accept uppercase Doubles and Integers
        //this assumes that the image type is STring and not blob
        int newID = JDBCConnector.addActivity(username, title, image, desc, longitude, latitude, location, rating, ratingCount, hostAttending, capacity, adventure, beach, books, entertainment, exercise, games, music, nightLife, outdoors, relax, shopping, sports, time);

        //return the ID of the newly created activity
        response.setStatus(HttpServletResponse.SC_OK);
        String success = "New activity " + title + "added with activityID = " + newID;
        pw.write(new Gson().toJson(success));
        pw.flush();

    }
}
