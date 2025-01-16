package com.Eshiksha.Entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class LessionDoubt {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int doubtId;
}
