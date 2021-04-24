public class RSVP {
    private int RSVPID;
    private int queuePos; //queuePos of -1 means the RSVP is not in queue and is valid, 0 is the front of the queue.

    public RSVP(int RSVPID, int queuePos)
    {
        this.RSVPID = RSVPID;
        this.queuePos = queuePos;
    }

    public int getRSVPID()
    {
        return RSVPID;
    }

    public void setRSVPID(int RSVPID)
    {
        this.RSVPID = RSVPID;
    }

    public int getQueuePos()
    {
        return queuePos;
    }

    public void setQueuePos(int queuePos)
    {
        this.queuePos = queuePos;
    }

}