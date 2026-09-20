package com.hotel.core.model.person;

import com.hotel.core.enums.MembershipLevel;

public class Customer extends Person {
    private MembershipLevel membershipLevel;
    private int loyaltyPoints;
    private boolean isVip;

    public Customer() {
    }

    public Customer(String id, String fullName, String phone, String email, MembershipLevel membershipLevel) {
        super(id, fullName, phone, email);
        this.membershipLevel = membershipLevel;
        this.loyaltyPoints = 0;
        this.isVip = (membershipLevel == MembershipLevel.GOLD || membershipLevel == MembershipLevel.PLATINUM);
    }

    public MembershipLevel getMembershipLevel() {
        return membershipLevel;
    }

    public void setMembershipLevel(MembershipLevel membershipLevel) {
        this.membershipLevel = membershipLevel;
    }

    public int getLoyaltyPoints() {
        return loyaltyPoints;
    }

    public void setLoyaltyPoints(int loyaltyPoints) {
        this.loyaltyPoints = loyaltyPoints;
    }

    public boolean isVip() {
        return isVip;
    }

    public void setVip(boolean vip) {
        isVip = vip;
    }
}
