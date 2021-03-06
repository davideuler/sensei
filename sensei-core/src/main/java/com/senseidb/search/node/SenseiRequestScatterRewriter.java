package com.senseidb.search.node;

import java.util.Set;

import com.linkedin.norbert.javacompat.cluster.Node;
import com.senseidb.search.req.SenseiRequest;

public interface SenseiRequestScatterRewriter {
	SenseiRequest rewrite(SenseiRequest origReq,Node node, Set<Integer> partitions);
}
