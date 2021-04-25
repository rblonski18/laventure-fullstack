
public class Activity implements Comparable<Activity>{

    public enum SortBy {
        Rating,
        Distance
    }

    private int activityID;
    private String username;
    private String title;
    private String image;
    private String description;
    private double longitude;
    private double latitude;
    private String town;
    private double rating;
    private int ratingCount;
    private int RSVPCount;
    private int maxRSVPs;
    private String time;
    private boolean adventure;
    private boolean beach;
    private boolean books;
    private boolean entertainment;
    private boolean exercise;
    private boolean games;
    private boolean music;
    private boolean nightLife;
    private boolean outdoors;
    private boolean relax;
    private boolean shopping;
    private boolean sports;
    private double distance; //TODO: Add distance calculation method.
    private static SortBy sortBy = SortBy.Rating;

    public Activity(int activityID, String username, String title, String image, String description, double longitude,
                    double latitude, String town, double rating, int ratingCount, int RSVPCount, int maxRSVPs, String time,
                    boolean adventure, boolean beach, boolean books, boolean entertainment, boolean exercise, boolean games,
                    boolean music, boolean nightLife, boolean outdoors, boolean relax, boolean shopping, boolean sports) {
        super();
        this.activityID = activityID;
        this.username = username;
        this.title = title;
        this.image = image;
        this.description = description;
        this.longitude = longitude;
        this.latitude = latitude;
        this.town = town;
        this.rating = rating;
        this.ratingCount = ratingCount;
        this.RSVPCount = RSVPCount;
        this.maxRSVPs = maxRSVPs;
        this.time = time;
        this.adventure = adventure;
        this.beach = beach;
        this.books = books;
        this.entertainment = entertainment;
        this.exercise = exercise;
        this.games = games;
        this.music = music;
        this.nightLife = nightLife;
        this.outdoors = outdoors;
        this.relax = relax;
        this.shopping = shopping;
        this.sports = sports;
    }

    public int getActivityID() {
        return activityID;
    }

    public void setActivityID(int activityID) {
        this.activityID = activityID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public String getTown() {
        return town;
    }

    public void setTown(String town) {
        this.town = town;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(int ratingCount) {
        this.ratingCount = ratingCount;
    }

    public int getRSVPCount() {
        return RSVPCount;
    }

    public void setRSVPCount(int rSVPCount) {
        RSVPCount = rSVPCount;
    }

    public int getMaxRSVPs() {
        return maxRSVPs;
    }

    public void setMaxRSVPs(int maxRSVPs) {
        this.maxRSVPs = maxRSVPs;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public boolean isAdventure() {
        return adventure;
    }

    public void setAdventure(boolean adventure) {
        this.adventure = adventure;
    }

    public boolean isBeach() {
        return beach;
    }

    public void setBeach(boolean beach) {
        this.beach = beach;
    }

    public boolean isBooks() {
        return books;
    }

    public void setBooks(boolean books) {
        this.books = books;
    }

    public boolean isEntertainment() {
        return entertainment;
    }

    public void setEntertainment(boolean entertainment) {
        this.entertainment = entertainment;
    }

    public boolean isExercise() {
        return exercise;
    }

    public void setExercise(boolean exercise) {
        this.exercise = exercise;
    }

    public boolean isGames() {
        return games;
    }

    public void setGames(boolean games) {
        this.games = games;
    }

    public boolean isMusic() {
        return music;
    }

    public void setMusic(boolean music) {
        this.music = music;
    }

    public boolean isNightLife() {
        return nightLife;
    }

    public void setNightLife(boolean nightLife) {
        this.nightLife = nightLife;
    }

    public boolean isOutdoors() {
        return outdoors;
    }

    public void setOutdoors(boolean outdoors) {
        this.outdoors = outdoors;
    }

    public boolean isRelax() {
        return relax;
    }

    public void setRelax(boolean relax) {
        this.relax = relax;
    }

    public boolean isShopping() {
        return shopping;
    }

    public void setShopping(boolean shopping) {
        this.shopping = shopping;
    }

    public boolean isSports() {
        return sports;
    }

    public void setSports(boolean sports) {
        this.sports = sports;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public static SortBy getSortBy() {
        return sortBy;
    }

    public static void setSortBy(SortBy sortBy) {
        Activity.sortBy = sortBy;
    }

    @Override
    public int compareTo(Activity o)
    {
        if (sortBy == SortBy.Rating)
        {
            return Double.compare(rating, o.getRating());
        }
        else
        {
            return Double.compare(distance, o.getDistance());
        }
    }
}