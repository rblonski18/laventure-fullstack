
public class User {
    private int userID;
    private String email;
    private String name;
    private String username;
    private boolean facebookUser;
    private int activityID1;
    private int activityID2;
    private int activityID3;
    private int activityID4;
    private int activityID5;

    public User(int userID, String email, String name, String username, boolean facebookUser, int activityID1, int activityID2,
                int activityID3, int activityID4, int activityID5) {
        this.userID = userID;
        this.email = email;
        this.name = name;
        this.username = username;
        this.facebookUser = facebookUser;
        this.activityID1 = activityID1;
        this.activityID2 = activityID2;
        this.activityID3 = activityID3;
        this.activityID4 = activityID4;
        this.activityID5 = activityID5;
    }

    public int getUserID() {
        return userID;
    }
    public void setUserID(int userID) {
        this.userID = userID;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public boolean isFacebookUser() {
        return facebookUser;
    }
    public void setFacebookUser(boolean facebookUser) {
        this.facebookUser = facebookUser;
    }
    public int getActivityID1() {
        return activityID1;
    }
    public void setActivityID1(int activityID1) {
        this.activityID1 = activityID1;
    }
    public int getActivityID2() {
        return activityID2;
    }
    public void setActivityID2(int activityID2) {
        this.activityID2 = activityID2;
    }
    public int getActivityID3() {
        return activityID3;
    }
    public void setActivityID3(int activityID3) {
        this.activityID3 = activityID3;
    }
    public int getActivityID4() {
        return activityID4;
    }
    public void setActivityID4(int activityID4) {
        this.activityID4 = activityID4;
    }
    public int getActivityID5() {
        return activityID5;
    }
    public void setActivityID5(int activityID5) {
        this.activityID5 = activityID5;
    }
}