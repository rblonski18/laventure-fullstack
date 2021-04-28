
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
        String latitude_str = body.get("latitude");
        String longitude_str = body.get("longitude");
        String image = body.get("image");
        String rating_str = body.get("rating");
        String time = body.get("time");
        String date = body.get("date");
        String capacity_str = body.get("capacity");
        String attending_str = body.get("attending");
        
        String adventure_str = body.get("adventure");
        String beach_str = body.get("beach");
        String books_str = body.get("books");
        String entertainment_str = body.get("entertainment");
        String exercise_str = body.get("exercise");
        String games_str = body.get("games");
        String music_str = body.get("music");
        String nightLife_str = body.get("nightlife");
        String outdoors_str = body.get("outdoors");
        String relax_str = body.get("relax");
        String shopping_str = body.get("shopping");
        String sports_str = body.get("sports");
        
        boolean adventure = Boolean.parseBoolean(adventure_str);
        boolean beach = Boolean.parseBoolean(beach_str);
        boolean books = Boolean.parseBoolean(books_str);
        boolean entertainment = Boolean.parseBoolean(entertainment_str);
        boolean exercise = Boolean.parseBoolean(exercise_str);
        boolean games = Boolean.parseBoolean(games_str);
        boolean music = Boolean.parseBoolean(music_str);
        boolean nightLife = Boolean.parseBoolean(nightLife_str);
        boolean outdoors = Boolean.parseBoolean(outdoors_str);
        boolean relax = Boolean.parseBoolean(relax_str);
        boolean shopping = Boolean.parseBoolean(shopping_str);
        boolean sports = Boolean.parseBoolean(sports_str);
        
        String username = body.get("username");

        //error check non-optional parameters
        if(title == null || desc == null || location == null || latitude_str == null || longitude_str == null || image == null || rating_str == null) {
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

        Boolean added = JDBCConnector.addActivity(username, title, image, desc, longitude, latitude, location, rating, ratingCount, hostAttending, capacity, adventure, beach, books, entertainment, exercise, games, music, nightLife, outdoors, relax, shopping, sports, time, date);
        if(added) {
            response.setStatus(HttpServletResponse.SC_OK);
            String success = "New activity added.";
            pw.write(new Gson().toJson(success));
            pw.flush();
        }
        else {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            String error = "Addition failed in JDBC.";
            pw.write(new Gson().toJson(error));
            pw.flush();
            return;
        }

    }
}
