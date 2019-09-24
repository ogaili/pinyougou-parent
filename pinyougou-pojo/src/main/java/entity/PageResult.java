package entity;

import java.io.Serializable;
import java.util.List;

public class PageResult implements Serializable {
    private long total;
    private List results;

    public PageResult(long total, List results) {
       this.total = total;
        this.results = results;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public List getResults() {
        return results;
    }

    public void setResults(List results) {
        this.results = results;
    }
}
