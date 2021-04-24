import java.util.ArrayList;

public class HeapSort {
    /*Run this function using HeapSort.<T>sort(list) to sort list.
     *T must extend comparable.
     *If ascending is true, the list will be sorted in ascending order. If it is false, the list will be sorted in descending order.
     */
    public static<T extends Comparable<T>> void sort(ArrayList<T> list, boolean ascending)
    {
        int size = list.size();
        int startInd = (size / 2) - 1;

        for (int ind = startInd; ind >= 0; ind--)
        {
            heapify(list, ind, size, ascending);
        }


        while(size > 1)
        {
            swap(list, 0, size - 1);
            heapify(list, 0, --size, ascending);
        }
    }

    public static<T extends Comparable<T>> void heapify(ArrayList<T> heap, int rootInd, int size, boolean ascending)
    {
        int largestInd = rootInd;
        int leftInd = (2 * rootInd + 1);
        int rightInd = (2* rootInd + 2);

        if (leftInd < size && (((heap.get(leftInd).compareTo(heap.get(largestInd)) > 0) && ascending) || ((heap.get(leftInd).compareTo(heap.get(largestInd)) < 0) && !ascending)))
        {
            largestInd = leftInd;
        }

        if (rightInd < size && (((heap.get(rightInd).compareTo(heap.get(largestInd)) > 0) && ascending) || ((heap.get(rightInd).compareTo(heap.get(largestInd)) < 0) && !ascending)))
        {
            largestInd = rightInd;
        }

        if (largestInd != rootInd)
        {
            swap(heap, largestInd, rootInd);

            heapify(heap, largestInd, size, ascending);
        }
    }

    public static<T extends Comparable<T>> void swap(ArrayList<T> heap, int ind1, int ind2)
    {
        T tempT = heap.get(ind1);
        heap.set(ind1, heap.get(ind2));
        heap.set(ind2, tempT);
    }
}