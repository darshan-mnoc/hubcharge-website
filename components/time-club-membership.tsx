"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { Crown, Check, ArrowRight, Zap, Gift, Car, Star } from "lucide-react";

export function TimeClubMembership() {
  const sectionRef = useRef<HTMLElement>(null);
  const [monthlySpend, setMonthlySpend] = useState(200);

  const rewardsRate = 0.0035;
  const monthlyRewards = (monthlySpend * rewardsRate).toFixed(2);
  const yearlyRewards = (monthlySpend * 12 * rewardsRate).toFixed(2);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".membership-content",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="membership" className="relative section-padding bg-gray-50 overflow-hidden">
      <div className="section-container">
        {/* Header */}
        <div className="membership-content text-center mb-16">
          <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">HubCharge Membership</span>
          </div>
          <h2 className="heading-section mb-6">
            Your time deserves
            <span className="text-gradient"> rewards</span>
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto">
            Every dollar you spend earns you rewards. The more you live, the more you save.
          </p>
        </div>

        {/* Main Cards Grid */}
        <div className="membership-content grid lg:grid-cols-2 gap-6 mb-12">
          {/* Free Membership */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Pay As You Go</p>
                <h3 className="text-2xl font-bold text-gray-900">Standard</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <Car className="h-7 w-7 text-gray-500" />
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-gray-900">Free</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">No commitment needed</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Access all HubCharge locations",
                "$12.50 flat rate per charge",
                "Valet service included",
                "Order food & drinks to car",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-600">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-gray-500" strokeWidth={2.5} />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="w-full btn btn-secondary rounded-full">
              Start Charging
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Dedicated Membership */}
          <div className="relative overflow-hidden rounded-3xl shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500" />

            {/* Badge */}
            <div className="absolute -top-0 left-1/2 -translate-x-1/2 translate-y-4 z-10">
              <div className="bg-white text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Star className="h-3 w-3" />
                Best Value
              </div>
            </div>

            <div className="relative p-8 pt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/70 text-sm mb-1">Dedicated Charger</p>
                  <h3 className="text-2xl font-bold text-white">Member</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Zap className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-white">$1,009</span>
                  <span className="text-white/70">/year</span>
                </div>
                <p className="text-white/60 text-sm mt-2">Your personal charging spot</p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Dedicated charger reserved for you",
                  "FREE charging every time",
                  "Priority valet service",
                  "Earn $0.0035 per $ spent at Hub",
                  "Exclusive member lounge access",
                  "Premium partner perks & discounts",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full py-4 rounded-full font-semibold bg-white hover:bg-white/90 text-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                Become a Member
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Rewards Calculator */}
        <div className="membership-content">
          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="icon-box icon-box-primary">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Rewards Calculator</h3>
                <p className="text-gray-400 text-sm">See how much you'll earn back</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Slider */}
              <div>
                <p className="text-gray-500 text-sm mb-3">Monthly spend at HubCharge locations</p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl font-bold text-gray-900">${monthlySpend}</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={monthlySpend}
                  onChange={(e) => setMonthlySpend(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-5
                    [&::-webkit-slider-thumb]:h-5
                    [&::-webkit-slider-thumb]:bg-orange-500
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-lg
                    [&::-webkit-slider-thumb]:shadow-orange-200"
                />
                <div className="flex justify-between text-gray-400 text-xs mt-2">
                  <span>$50</span>
                  <span>$500</span>
                  <span>$1000</span>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-5 text-center border border-gray-100">
                  <p className="text-gray-400 text-xs mb-2">Monthly Rewards</p>
                  <p className="text-2xl font-bold text-orange-500">${monthlyRewards}</p>
                </div>
                <div className="rounded-2xl p-5 text-center bg-orange-50 border border-orange-100">
                  <p className="text-orange-600/70 text-xs mb-2">Yearly Rewards</p>
                  <p className="text-2xl font-bold text-orange-600">${yearlyRewards}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-xs mt-6 text-center">
              Earn $0.0035 for every dollar spent on food, drinks, and services at HubCharge partner locations.
            </p>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="membership-content text-center mt-12">
          <p className="text-gray-400 text-sm">
            All memberships include <span className="text-gray-600 font-medium">free cancellation</span> anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
