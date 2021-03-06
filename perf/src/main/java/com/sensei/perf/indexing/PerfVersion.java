package com.sensei.perf.indexing;

import java.util.Comparator;

import org.apache.log4j.Logger;


public class PerfVersion implements Comparable<PerfVersion>{
	private static Logger log = Logger.getLogger(PerfVersion.class);
	
	public int iter;
	public long version;
	
	public PerfVersion(int iter,long ver){
		this.iter = iter;
		this.version = ver;
	}
	
	@Override
	public int compareTo(PerfVersion o) {
		int v = iter-o.iter;
		
		if (v==0){
			if (version<o.version){
				v = -1;
			}
			else if (version>o.version){
				v = 1 ;
			}
		}
		return v;
	}
	

	@Override
	public String toString(){
		StringBuffer buf = new StringBuffer();
		buf.append(iter).append(",").append(version);
		return buf.toString();
	}
	
	public static final PerfVersion parse(String s){
		if (s==null || s.trim().length()==0){
			return new PerfVersion(0,0L); 
		}
		
		String[] parts = s.split(",");
		if (parts==null || parts.length!=2){
			return new PerfVersion(0,0L);
		}
		int iter = Integer.parseInt(parts[0]);
		long ver = Long.parseLong(parts[1]);
		
		return new PerfVersion(iter,ver);
	}
	
	public static final class PerfVersionComparator implements Comparator<String>{

		@Override
		public int compare(String s1, String s2) {
			PerfVersion v1 = PerfVersion.parse(s1);
			PerfVersion v2 = PerfVersion.parse(s2);
			return v1.compareTo(v2);
		}
		
	}
}