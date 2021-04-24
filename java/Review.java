public class Review implements Comparable<Review>{
    private int reviewNum;
    private int userID;
    private String username;
    private double ratingVal;
    private String reviewText;

    public Review(int reviewNum, int userID, String username, double ratingVal, String reviewText) {
        this.reviewNum = reviewNum;
        this.userID = userID;
        this.username = username;
        this.ratingVal = ratingVal;
        this.reviewText = reviewText;
    }

    public int getReviewNum() {
        return reviewNum;
    }

    public void setReviewNum(int reviewNum) {
        this.reviewNum = reviewNum;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserId(int userID) {
        this.userID = userID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public double getRatingVal() {
        return ratingVal;
    }

    public void setRatingVal(double ratingVal) {
        this.ratingVal = ratingVal;
    }

    public String getReviewText() {
        return reviewText;
    }

    public void setReviewText(String reviewText) {
        this.reviewText = reviewText;
    }

    @Override
    public int compareTo(Review o) {
        return Double.compare(ratingVal, o.getRatingVal());
    }
}