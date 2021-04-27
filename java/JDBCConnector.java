
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.concurrent.locks.ReentrantLock;

public class JDBCConnector {
    private static ReentrantLock addRSVPLock = new ReentrantLock();
    private static String dbName = "ebdb";
    private static String userName = "dbuser";
    private static String password = "marcopapa";
    private static String hostname = "aa1bsd9i8xumf8s.ccwudqpljmzy.us-east-2.rds.amazonaws.com";
    private static String port = "3306";
    private static String jdbcUrl = "jdbc:mysql://" + hostname + ":" + port + "/" + dbName + "?user=" + userName + "&password=" + password;
    
    
    //Returns userID of added user. Returns -1 if username already exists.
    public static int normalRegister(String email, String name, String username, String password)
    {
        Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;

        Integer userID = -1;

        MessageDigest digest;
        String hashedPass;

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            digest = MessageDigest.getInstance("SHA-256");
            hashedPass =  new String(digest.digest(password.getBytes(StandardCharsets.UTF_8)), StandardCharsets.UTF_8);
            conn = DriverManager.getConnection(jdbcUrl);

            st = conn.prepareStatement("SELECT * FROM Users WHERE Username='" + username + "'");
            rs = st.executeQuery();
            if (!rs.next())
            {
                PreparedStatement st2 = conn.prepareStatement("INSERT INTO Users (Email, Name, Username, Password, FacebookUser) VALUES ('" + email + "','" + name + "','" + username + "','" + hashedPass + "', FALSE)");
                st2.executeUpdate();
                st2.close();
                PreparedStatement st3 = conn.prepareStatement("SELECT UserID FROM Users WHERE Username = \"" + username + "\"");
                ResultSet rs2 = st3.executeQuery();
                rs2.next();
                userID = rs2.getInt("UserID");
            }
            
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        
        catch (NoSuchAlgorithmException e)
        {
            System.out.println("Error occured attempting to hash.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return userID;
    }

    //Returns userID if user/password combination is valid. Returns -1 otherwise.
    public static int normalLogin(String username, String password)
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        int userID = -1;

        MessageDigest digest;
        String hashedPass;

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            digest = MessageDigest.getInstance("SHA-256");
            hashedPass =  new String(digest.digest(password.getBytes(StandardCharsets.UTF_8)), StandardCharsets.UTF_8);
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            rs = st.executeQuery("SELECT * FROM Users WHERE Username='" + username + "' AND Password='" + hashedPass + "' AND FacebookUser=FALSE");
            if (rs.next())
            {
                userID = rs.getInt(1);
            }
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch (NoSuchAlgorithmException e)
        {
            System.out.println("Error occured attempting to hash.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return userID;
    }

    //Returns userID of added user. Use facebookLogin whenever a facebook user logs in and it will call this function if it is a new user.
    private static int facebookRegister(String email, String name)
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        int userID = -1;

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            st.execute("INSERT INTO Users (Email, Name, Username, FacebookUser) VALUES ('" + email + "','" + name + "','" + email + "', TRUE)");
            rs = st.executeQuery("SELECT LAST_INSERT_ID()");
            rs.next();
            userID = rs.getInt(1);
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return userID;
    }

    //Returns userID of logged in user. Creates a new user if the user does not exist. Utilizes name for registering.
    public static int facebookLogin(String email, String name)
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        int userID = -1;

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            rs = st.executeQuery("SELECT * FROM Users WHERE Email='" + email + "' AND FacebookUser=TRUE");
            if (rs.next())
            {
                userID = rs.getInt(1);
            }
            else
            {
                userID = facebookRegister(email, name);
            }
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return userID;
    }

    public static ArrayList<Review> getReviews(int activityID)
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        int reviewNum;
        int userId;
        String username;
        double ratingVal;
        String reviewText;

        ArrayList<Review> reviews = new ArrayList<Review>();

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            rs = st.executeQuery("SELECT * FROM Reviews r,Users u WHERE ActivityID=" + activityID + " AND r.UserID=u.UserID");
            while (rs.next())
            {
                reviewNum = rs.getInt("ReviewNum");
                userId = rs.getInt("UserId");
                username = rs.getString("Username");
                ratingVal = rs.getInt("RatingVal");
                reviewText = rs.getString("ReviewText");
                reviews.add(new Review(reviewNum, userId, username, ratingVal, reviewText));
            }
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return reviews;
    }

    
    public static ArrayList<Activity> getActivities()
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        int activityID;
        String username;
        String title;
        String image;
        String description;
        double longitude;
        double latitude;
        String town;
        double rating;
        int ratingCount;
        int RSVPCount;
        int maxRSVPs;
        String time;
        boolean adventure;
        boolean beach;
        boolean books;
        boolean entertainment;
        boolean exercise;
        boolean games;
        boolean music;
        boolean nightLife;
        boolean outdoors;
        boolean relax;
        boolean shopping;
        boolean sports;

        ArrayList<Activity> activities = new ArrayList<Activity>();

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            rs = st.executeQuery("SELECT * FROM Activities");
            while (rs.next())
            {
                activityID = rs.getInt("ActivityID");
                username = rs.getString("Username");
                title = rs.getString("Title");
                image = rs.getString("image");
                description = rs.getString("Description");
                longitude = rs.getDouble("Longitude");
                latitude = rs.getDouble("Latitude");
                town = rs.getString("Town");
                rating = rs.getDouble("Rating");
                ratingCount = rs.getInt("RatingCount");
                RSVPCount = rs.getInt("RSVPCount");
                maxRSVPs = rs.getInt("MaxRSVPs");
                time = rs.getString("Time");
                adventure = rs.getBoolean("Adventure");
                beach = rs.getBoolean("Beach");
                books = rs.getBoolean("Books");
                entertainment = rs.getBoolean("Entertainment");
                exercise = rs.getBoolean("Exercise");
                games = rs.getBoolean("Games");
                music = rs.getBoolean("Music");
                nightLife = rs.getBoolean("NightLife");
                outdoors = rs.getBoolean("Outdoors");
                relax = rs.getBoolean("Relax");
                shopping = rs.getBoolean("Shopping");
                sports = rs.getBoolean("Sports");
                activities.add(new Activity(activityID, username, title, image, description, longitude,
                        latitude, town, rating, ratingCount, RSVPCount, maxRSVPs, time,
                        adventure, beach, books, entertainment, exercise, games,
                        music, nightLife, outdoors, relax, shopping, sports));
            }
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return activities;
    }

    //Returns activityID of added activity. Returns -1 if SQL error.
    public static Boolean addActivity(String username, String title, String image, String description, double longitude,
                                  double latitude, String town, double rating, int ratingCount, int RSVPCount, int maxRSVPs, boolean adventure,
                                  boolean beach, boolean books, boolean entertainment, boolean exercise, boolean games, boolean music, boolean nightLife,
                                  boolean outdoors, boolean relax, boolean shopping, boolean sports, String time)
    {
        Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;

        Boolean added = false;
        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);

            //TODO: fix apostrophes
            st = conn.prepareStatement("INSERT INTO Activities (Username,Title,Image,Description,Longitude,Latitude,Town,Rating,RatingCount,RSVPCount,MaxRSVPs,Adventure,Beach,Books,Entertainment,Exercise,Games,Music,NightLife,Outdoors,Relax,Shopping,Sports,Time) VALUES ('" + username + "','" + title + "','" + image + "',\"" + description + "\"," + longitude + "," + latitude + ",'" + town + "'," + rating + "," + ratingCount + "," + RSVPCount + "," + maxRSVPs + ","  + adventure + ","  + beach + ","  + books + ","  + entertainment + ","  + exercise + ","  + games + ","  + music + "," + nightLife + "," + outdoors + ","  + relax + ","  + shopping + "," + sports + ",'" + time + "')");
            
            st.executeUpdate();
            added = true;
            
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
            
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return added;
    }

    public static ArrayList<User> getUsers()
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        int userID;
        String email;
        String name;
        String username;
        boolean facebookUser;
        int activityID1;
        int activityID2;
        int activityID3;
        int activityID4;
        int activityID5;

        ArrayList<User> users = new ArrayList<User>();

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            rs = st.executeQuery("SELECT * FROM Users");
            while (rs.next())
            {
                userID = rs.getInt("UserID");
                email = rs.getString("Email");
                name = rs.getString("Name");
                username = rs.getString("Username");
                facebookUser = rs.getBoolean("FacebookUser");
                activityID1 = rs.getInt("ActivityID1");
                activityID2 = rs.getInt("ActivityID2");
                activityID3 = rs.getInt("ActivityID3");
                activityID4 = rs.getInt("ActivityID4");
                activityID5 = rs.getInt("ActivityID5");
                users.add(new User(userID, email, name, username, facebookUser, activityID1, activityID2,
                        activityID3, activityID4, activityID5));
            }
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return users;
    }

    //Updates the users most recently viewed activity in just the database.
    public static void visitActivity(String username, int activityID)
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        int nextActivityID;
        int nextActivityInd = 1;

        MRUCache mru = new MRUCache(5);


        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            rs = st.executeQuery("SELECT * FROM Users WHERE Username='" + username + "'");
            rs.next();

            do
            {
                nextActivityID = rs.getInt("ActivityID" + nextActivityInd);
                nextActivityInd++;
                if (nextActivityID != 0)
                {
                    mru.refer(nextActivityID);
                }
            } while(nextActivityID != 0 && nextActivityInd <= 5);
            mru.refer(activityID);

            int activityIDs[] = mru.getFiveVals();

            st.execute("UPDATE Users SET ActivityID5=" + activityIDs[4] + ", ActivityID4=" + activityIDs[3] + ", ActivityID3=" + activityIDs[2] + ", ActivityID2=" + activityIDs[1] + ", ActivityID1=" + activityIDs[0] + " WHERE Username='" + username + "'");
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }
    }

    public static void addReview(int activityID, String username, double ratingVal, String reviewText)
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            rs = st.executeQuery("SELECT * FROM Users WHERE Username='" + username + "'");
            if (rs.next())
            {
            	int userID = rs.getInt("UserID");
            	st.execute("INSERT INTO Reviews (ActivityID,UserID,RatingVal,ReviewText) VALUES (" + activityID + "," + userID + "," + ratingVal + ",'" + reviewText + "')");
            	st.execute("UPDATE Activities SET Rating=((Rating*RatingCount)+" + ratingVal + ")/(RatingCount+1), RatingCount=RatingCount+1 WHERE ActivityID=" + activityID);
            }
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
            	if (rs != null)
            	{
            		rs.close();
            	}
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }
    }

    //Returns queuePos of new RSVP. Return of -1 means not in queue. Return of -100 means SQL error occurred.
    public static int addRSVP(int activityID, String username)
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        int queuedCount = 0;
        int highestQueuePos = -1;
        int queuePos = -100;

        int maxRSVPs = getMaxRSVPs(activityID);

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            rs = st.executeQuery("SELECT * FROM Users WHERE Username='" + username + "'");
            if (rs.next())
            {
            	int userID = rs.getInt("UserID");
            	rs.close();
	            addRSVPLock.lock();
	            rs = st.executeQuery("SELECT * FROM RSVPs WHERE ActivityID=" + activityID);
	            while(rs.next())
	            {
	                queuePos = rs.getInt("QueuePos");
	                if (queuePos > highestQueuePos)
	                {
	                    highestQueuePos = queuePos;
	                }
	                queuedCount++;
	            }
	
	            if (queuedCount < maxRSVPs)
	            {
	                queuePos = -1;
	            }
	            else
	            {
	                queuePos = highestQueuePos + 1;
	            }
	
	            System.out.println(queuePos + " " + highestQueuePos + " " + maxRSVPs);
	            st.execute("INSERT INTO RSVPs (ActivityID,UserID,QueuePos) VALUES (" + activityID + "," + userID + "," + queuePos + ")");
	            st.execute("UPDATE Activities SET RSVPCount=RSVPCount+1 WHERE ActivityID=" + activityID);
            }
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (addRSVPLock.isHeldByCurrentThread())
                {
                    addRSVPLock.unlock();
                }
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return queuePos;
    }

    //Returns true if RSVP was removed. Returns false if no RSVP with RSVPID found.
    public static boolean cancelRSVP(int activityID, String username)
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        int queuePos;

        boolean canceled = true;

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
        	st = conn.createStatement();
        	 rs = st.executeQuery("SELECT * FROM Users WHERE Username='" + username + "'");
             if (rs.next())
             {
             	int userID = rs.getInt("UserID");
	            rs = st.executeQuery("SELECT * FROM RSVPs WHERE UserID=" + userID + " AND ActivityID=" + activityID);
	            if (rs.next())
	            {
	                int RSVPID = rs.getInt("RSVPID");
	                queuePos = rs.getInt("QueuePos");
	                st.execute("DELETE FROM RSVPs WHERE RSVPID=" + RSVPID);
	                st.execute("UPDATE RSVPs SET QueuePos=QueuePos-1 WHERE QueuePos>=" + queuePos + " AND QueuePos>=0 AND ActivityID=" + activityID);
	                st.execute("UPDATE Activities SET RSVPCount=RSVPCount-1 WHERE ActivityID=" + activityID);
	            }
	            else
	            {
	                canceled = false;
	            }
	         }
             else
             {
            	 canceled = false;
             }
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return canceled;
    }

    //Returns queuePos of user for activity. -1 means RSVPed and not queued, -2 means not RSVPed. Return of -100 means SQL error occurred.
    public static int RSVPStatus(int activityID, String username)
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        boolean isRSVPed = false;
        int queuePos = -100;

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            rs = st.executeQuery("SELECT * FROM Users WHERE Username='" + username + "'");
            if (rs.next())
            {
            	int userID = rs.getInt("UserID");
            	rs.close();
	            rs = st.executeQuery("SELECT * FROM RSVPs WHERE ActivityID=" + activityID + " AND UserID=" + userID);
	            isRSVPed = rs.next();
	            if (isRSVPed)
	            {
	                queuePos = rs.getInt("QueuePos");
	            }
	            else
	            {
	                queuePos = -2;
	            }
            }
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return queuePos;
    }

    //Returns -1 if an error occurred.
    public static int getMaxRSVPs(int activityID)
    {
        Connection conn = null;
        Statement st = null;
        ResultSet rs = null;

        int maxRSVPs = -1;

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);
            st = conn.createStatement();
            rs = st.executeQuery("SELECT * FROM Activities WHERE ActivityID=" + activityID);
            rs.next();
            maxRSVPs = rs.getInt("MaxRSVPs");
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return maxRSVPs;
    }

	public static ArrayList<Activity> getRecentlyViewed(String username)
    {
        Connection conn = null;
        PreparedStatement st = null;
        ResultSet rs = null;
        
        int activityID;
        String activityUsername;
        String title;
        String image;
        String description;
        double longitude;
        double latitude;
        String town;
        double rating;
        int ratingCount;
        int RSVPCount;
        int maxRSVPs;
        String time;
        boolean adventure;
        boolean beach;
        boolean books;
        boolean entertainment;
        boolean exercise;
        boolean games;
        boolean music;
        boolean nightLife;
        boolean outdoors;
        boolean relax;
        boolean shopping;
        boolean sports;

        ArrayList<Activity> activities = new ArrayList<Activity>();
		
		ArrayList<Integer> ActivityIDs = new ArrayList<Integer>();

        try
        {
        	Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(jdbcUrl);

            st = conn.prepareStatement("SELECT * FROM Users WHERE Username='" + username + "'");
            rs = st.executeQuery();
            if (rs.next())
            {
                if (rs.getInt("ActivityID1") != 0)
				{
					ActivityIDs.add(rs.getInt("ActivityID1"));
					if (rs.getInt("ActivityID2") != 0)
					{
						ActivityIDs.add(rs.getInt("ActivityID2"));
						if (rs.getInt("ActivityID3") != 0)
						{
							ActivityIDs.add(rs.getInt("ActivityID3"));
							if (rs.getInt("ActivityID4") != 0)
							{
								ActivityIDs.add(rs.getInt("ActivityID4"));
								if (rs.getInt("ActivityID5") != 0)
								{
									ActivityIDs.add(rs.getInt("ActivityID5"));
								}
							}
						}
					}
				}
            }
			rs.close();
			for (int ind = 0; ind < ActivityIDs.size(); ind++)
			{
				st = conn.prepareStatement("SELECT * FROM Activities WHERE ActivityID=" + ActivityIDs.get(ind));
				rs = st.executeQuery();
				if (rs.next())
				{
					activityID = rs.getInt("ActivityID");
					activityUsername = rs.getString("Username");
	                title = rs.getString("Title");
	                image = rs.getString("Image");
	                description = rs.getString("Description");
	                longitude = rs.getDouble("Longitude");
	                latitude = rs.getDouble("Latitude");
	                town = rs.getString("Town");
	                rating = rs.getDouble("Rating");
	                ratingCount = rs.getInt("RatingCount");
	                RSVPCount = rs.getInt("RSVPCount");
	                maxRSVPs = rs.getInt("MaxRSVPs");
	                time = rs.getString("Time");
	                adventure = rs.getBoolean("Adventure");
	                beach = rs.getBoolean("Beach");
	                books = rs.getBoolean("Books");
	                entertainment = rs.getBoolean("Entertainment");
	                exercise = rs.getBoolean("Exercise");
	                games = rs.getBoolean("Games");
	                music = rs.getBoolean("Music");
	                nightLife = rs.getBoolean("NightLife");
	                outdoors = rs.getBoolean("Outdoors");
	                relax = rs.getBoolean("Relax");
	                shopping = rs.getBoolean("Shopping");
	                sports = rs.getBoolean("Sports");
	                activities.add(new Activity(activityID, activityUsername, title, image, description, longitude,
	                        latitude, town, rating, ratingCount, RSVPCount, maxRSVPs, time,
	                        adventure, beach, books, entertainment, exercise, games,
	                        music, nightLife, outdoors, relax, shopping, sports));
				}
				if (rs != null)
				{
					rs.close();
				}
			}
        }
        catch (SQLException e)
        {
            System.out.println("SQL Exception occured accessing database.");
        }
        catch(ClassNotFoundException e) {
        	System.out.println("could not load driver.");
        }

        finally
        {
            try
            {
                if (rs != null)
                {
                    rs.close();
                }
                if (st != null)
                {
                    st.close();
                }
                if (conn != null)
                {
                    conn.close();
                }
            }
            catch (SQLException e)
            {
                System.out.println("SQL Exception occured closing connection/statement/result set.");
            }
        }

        return activities;
    }

}