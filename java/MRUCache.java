import java.util.Stack;
import java.util.HashSet;

public class MRUCache {
    private Stack<Integer> stack;
    private HashSet<Integer> hashSet;
    private int CACHE_SIZE = 0;

    MRUCache(int capacity)
    {
        stack = new Stack<>();
        hashSet = new HashSet<>();
        CACHE_SIZE = capacity;
    }

    public void refer(int page)
    {
        if (!hashSet.contains(page))
        {
            if (stack.size() == CACHE_SIZE)
            {
                int last = stack.remove(CACHE_SIZE - 1);
                hashSet.remove(last);
            }
        }
        else
        {
            stack.removeElement(page);
        }
        stack.push(page);
        hashSet.add(page);
    }

    //Returns the front 5 elements of the cache (removing them from the cache).
    public int[] getFiveVals() {
        int vals[] = new int[5];
        for (int ind = 0; ind < 5; ind++)
        {
            if (!stack.isEmpty())
            {
                vals[ind] = stack.pop();
            }
            else
            {
                vals[ind] = 0;
            }
        }
        return vals;
    }
}