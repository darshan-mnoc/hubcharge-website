"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Crown, Check, ArrowRight, Zap, Gift, Car, Star } from "lucide-react";

export function TimeClubMembership() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [monthlySpend, setMonthlySpend] = useState(200);

  const rewardsRate = 0.0035;
  const monthlyRewards = (monthlySpend * rewardsRate).toFixed(2);
  const yearlyRewards = (monthlySpend * 12 * rewardsRate).toFixed(2);

  return (
    <section
      ref={sectionRef}
      id="membership"
      className="relative section-padding bg-[#080808] overflow-hidden"
    >
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-orange-500/10 rounded-full blur-[200px]" />

      <div className="section-container relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 badge badge-primary mb-8">
            <Crown className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              HubCharge Membership
            </span>
          </div>
          <h2 className="heading-section text-white mb-6">
            Your time deserves
            <span className="text-gradient text-glow"> rewards</span>
          </h2>
          <p className="text-body-lg max-w-2xl mx-auto">
            Every dollar you spend earns you rewards. The more you live, the
            more you save.
          </p>
        </motion.div>

        {/* Main Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-12">
          {/* Free Membership */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="card p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/40 text-sm mb-1">Pay As You Go</p>
                <h3 className="text-2xl font-bold text-white">Standard</h3>
              </div>
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center border border-white/10">
                <Car className="h-7 w-7 text-white/60" />
              </div>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-bold text-white">Free</span>
              <p className="text-white/30 text-sm mt-2">No commitment needed</p>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                "Access all HubCharge locations",
                "$12.50 flat rate per charge",
                "Attendant service included",
                "Order food & drinks to car",
              ].map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 text-white/60"
                >
                  <div className="w-5 h-5 rounded-full glass flex items-center justify-center flex-shrink-0">
                    <Check
                      className="h-3 w-3 text-white/40"
                      strokeWidth={2.5}
                    />
                  </div>
                  {feature}
                </motion.li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn btn-secondary"
            >
              Start Charging
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>

          {/* Dedicated Membership */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-3xl"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 30px rgba(244, 130, 69, 0.2)",
                  "0 0 60px rgba(244, 130, 69, 0.4)",
                  "0 0 30px rgba(244, 130, 69, 0.2)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-500"
            />

            {/* Badge */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -top-0 left-1/2 -translate-x-1/2 translate-y-4 z-10"
            >
              <div className="bg-white text-orange-600 text-xs font-bold mt-4 px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                <Star className="h-3 w-3" />
                Best Value
              </div>
            </motion.div>

            <div className="relative p-8 pt-12">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/70 text-sm mb-1">
                    Dedicated Charger
                  </p>
                  <h3 className="text-2xl font-bold text-white">Member</h3>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Zap className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-bold text-white">$1,009</span>
                <span className="text-white/70">/year</span>
                <p className="text-white/60 text-sm mt-2">
                  Your personal charging spot
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Dedicated charger reserved for you",
                  "FREE charging every time",
                  "Priority attendant service",
                  "Earn $0.0035 per $ spent at Hub",
                  "Exclusive member lounge access",
                  "Premium partner perks & discounts",
                ].map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 text-white"
                  >
                    <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-full font-semibold bg-white hover:bg-white/90 text-orange-600 flex items-center justify-center gap-2 shadow-lg"
              >
                Become a Member
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Rewards Calculator */}
        {/* <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="icon-box icon-box-primary">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                Rewards Calculator
              </h3>
              <p className="text-white/40 text-sm">
                See how much you'll earn back
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-white/50 text-sm mb-3">
                Monthly spend at HubCharge locations
              </p>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-white">
                  ${monthlySpend}
                </span>
                <span className="text-white/30">/month</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-5
                  [&::-webkit-slider-thumb]:h-5
                  [&::-webkit-slider-thumb]:bg-orange-500
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:shadow-orange-500/30"
              />
              <div className="flex justify-between text-white/20 text-xs mt-2">
                <span>$50</span>
                <span>$500</span>
                <span>$1000</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass rounded-2xl p-5 text-center border border-white/10"
              >
                <p className="text-white/40 text-xs mb-2">Monthly Rewards</p>
                <p className="text-2xl font-bold text-orange-400">
                  ${monthlyRewards}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl p-5 text-center bg-orange-500/20 border border-orange-500/30"
              >
                <p className="text-white/60 text-xs mb-2">Yearly Rewards</p>
                <p className="text-2xl font-bold text-white">
                  ${yearlyRewards}
                </p>
              </motion.div>
            </div>
          </div>

          <p className="text-white/30 text-xs mt-6 text-center">
            Earn $0.0035 for every dollar spent on food, drinks, and services at
            HubCharge partner locations.
          </p>
        </motion.div> */}

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-white/30 text-sm">
            All memberships include{" "}
            <span className="text-white/50 font-medium">free cancellation</span>{" "}
            anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
